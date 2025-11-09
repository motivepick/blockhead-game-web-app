import {createAsyncThunk as createThunk, createSlice} from '@reduxjs/toolkit'
import {createNewField, makeMove} from '../api/service'
import {
    selectDifficulty,
    selectField,
    selectFieldSize,
    selectLastSetLetterId,
    selectUsedWords,
    selectWord
} from "./selectors"
import {equals, includes} from "../common"
import {AppDispatch, RootState} from "./store";

const readFieldSize = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem('fieldSize') || '');
        if ([3, 5, 7].includes(parsed)) {
            return parsed
        }
    } catch (ignored) {
    }
    return 5
}

const readDifficulty = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem('difficulty') || '');
        if (['EASY', 'MEDIUM', 'HARD'].includes(parsed)) {
            return parsed
        }
    } catch (ignored) {
    }
    return 'MEDIUM'
}

const initialState = {
    fieldSize: readFieldSize(),
    difficulty: readDifficulty(),
    field: [[]] as Field,
    lastSetLetter: { id: [-1, -1] as Cell, value: '' },
    wordPath: [] as Cell[],
    computerWordPath: [] as Cell[],
    wordsByUser: [] as string[],
    wordsByComputer: [] as string[],
    errors: [] as UserError[],
    status: 'IDLE',
    hinting: false
}

export const createAsyncThunk = createThunk.withTypes<{ state: RootState, dispatch: AppDispatch }>()

export const setDifficulty = createAsyncThunk(
    'game/difficulty',
    async (difficulty: string) => {
        localStorage.setItem('difficulty', JSON.stringify(difficulty))
        return difficulty
    }
)

export const setFieldSize = createAsyncThunk(
    'game/fieldSize',
    async (fieldSize: number) => {
        localStorage.setItem('fieldSize', JSON.stringify(fieldSize))
        return fieldSize
    }
)

export const submitUserMove = createAsyncThunk(
    'moves/user',
    // Note: if an error happens here, it's only visible in the submitUserMove.rejected case in the extra reducers, in action.error.message
    async (_, {getState}) => {
        const state = getState()
        console.log('word is', selectWord(state))
        return selectWord(state)
    }
)

export const fetchComputerMove = createAsyncThunk(
    'moves/computer',
    async (_, {getState}) => {
        const state = getState()
        return makeMove({
            field: selectField(state),
            usedWords: selectUsedWords(state),
            difficulty: selectDifficulty(state)
        })
    }
)

export const fetchHint = createAsyncThunk(
    'moves/hint',
    async (_, { getState }) => {
        const state = getState()
        return makeMove({ field: selectField(state), usedWords: selectUsedWords(state), difficulty: 'HARD' })
    }
)

export const fetchCreateNewField = createAsyncThunk('fetchCreateNewField', async (size: Number) => createNewField(size))

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setComputerWordPath(state, {payload}) {
            state.computerWordPath = payload
        },
        updateWord(state, action) {
            const {cell} = action.payload
            state.wordPath.push(cell)
            const word = selectWord(state)
            state.errors =
                [checkUsedNewLetter(selectLastSetLetterId(state), state.wordPath), checkWordAlreadyUsed(word, selectUsedWords(state))]
                    .filter(it => it.id !== '')
        },
        resetWord(state){
            state.wordPath = []
        },
        resetHinting(state) {
            placeLetterOnFieldState(state, { letter: '.', cell: state.lastSetLetter.id })
            state.hinting = false
        },
        resetLastSetLetter(state) {
            state.lastSetLetter = {id: [-1, -1], value: ''}
        },
        placeLetter(state, action) {
            state.errors = []
            const { letter, cell } = action.payload

            placeLetterOnFieldState(state, action.payload)

            if (!equals(state.lastSetLetter.id, [-1, -1])) {
                placeLetterOnFieldState(state, { letter: '.', cell: selectLastSetLetterId(state) })
            }

            state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
            state.wordPath = []
        },
        removeLetter(state, action) {
            const { cell } = action.payload

            if (equals(state.lastSetLetter.id, cell)) {
                placeLetterOnFieldState(state, { letter: '.', cell })
                resetLetterState(state)
                state.errors = []
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setDifficulty.fulfilled, (state, action) => {
                state.difficulty = action.payload
            })
            .addCase(setFieldSize.fulfilled, (state, action) => {
                state.fieldSize = action.payload
            })
            .addCase(submitUserMove.fulfilled, (state, action) => {
                const word = action.payload
                if (state.errors.length > 0) return

                commitWordState(state, word, "user")

                resetLetterState(state)
                state.wordPath = []
            })
            .addCase(fetchComputerMove.pending, (state) => {
                state.status = 'PENDING'
            })
            .addCase(fetchComputerMove.fulfilled, (state, action) => {
                if (state.errors.length > 0) return
                const { letter, cell } = action.payload

                placeLetterOnFieldState(state, { letter, cell })
                commitWordState(state, action.payload.word, "computer")
                state.computerWordPath = action.payload.path
                state.status = 'SUCCEEDED'
                state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
            })
            .addCase(fetchHint.fulfilled, (state, action) => {
                const { letter, cell } = action.payload

                state.computerWordPath = action.payload.path.map(([x, y]) => [x, y])

                placeLetterOnFieldState(state, { letter, cell })
                state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
                state.hinting = true
            })
            .addCase(fetchCreateNewField.pending, (state) => {
                const fieldSize = selectFieldSize(state)
                state.field = Array.from({ length: fieldSize }, () => Array.from({ length: fieldSize }, () => '.'))
            })
            .addCase(fetchCreateNewField.fulfilled, (state, action) => {
                state.field = action.payload
            })
    }
})

const commitWordState = (state: RootState, word: string, player: string) => {
    if (player === "computer") {
        state.wordsByComputer.push(word)
    } else {
        state.wordsByUser.push(word)
    }
}

const resetLetterState = (state: RootState) =>
    state.lastSetLetter = { id: [-1, -1], value: '' }

const placeLetterOnFieldState = (state: RootState, { letter, cell }: {letter: string, cell: Cell}) => {
    const [x, y] = cell
    state.field[x][y] = letter.toUpperCase()
}

const emptyError: UserError = { id: '', messageKey: '' }

const checkWordAlreadyUsed = (word: string, usedWords: string[]): UserError =>
    usedWords.includes(word) ? {id: 'WordAlreadyUsed', messageKey: 'errorWordIsAlreadyUsed'} : emptyError

const checkUsedNewLetter = (cell: Cell, path: Cell[]): UserError =>
    includes(path, cell) ? emptyError : {id: 'NoNewLetterUsed', messageKey: 'errorNewLetterUnused'}

export const { resetHinting, resetLastSetLetter, setComputerWordPath, updateWord, placeLetter, removeLetter, resetWord } = gameSlice.actions

export default gameSlice.reducer
