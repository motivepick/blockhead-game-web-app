// @ts-nocheck
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {createNewField, makeMove} from '../api/service'
import {selectDifficulty, selectField, selectFieldSize, selectLastSetLetterId, selectUsedWords} from "./selectors"
import {equals, includes} from "../common"

const readFieldSize = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem('fieldSize'));
        if ([3, 5, 7].includes(parsed)) {
            return parsed
        }
    } catch (ignored) {
    }
    return 5
}

const readDifficulty = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem('difficulty'));
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
    field: [[]],
    lastSetLetter: { id: [-1, -1] as Cell, value: '' },
    wordPath: [],
    computerWordPath: [],
    wordsByUser: [],
    wordsByComputer: [],
    errors: [],
    status: 'IDLE',
    hinting: false
}

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
        return state.word.join('')
    }
)

export const fetchComputerMove = createAsyncThunk(
    'moves/computer',
    async (word, { getState }) => {
        const state = getState()
        return makeMove({ field: selectField(state), usedWords: selectUsedWords(state) , difficulty: selectDifficulty(state) })
    }
)

export const fetchHint = createAsyncThunk(
    'moves/hint',
    async (word, { getState }) => {
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
            const {letter, cell} = action.payload
            state.word.push(letter)
            state.wordPath.push(cell)

            const word = state.word.join('')
            state.errors =
                [checkUsedNewLetter(selectLastSetLetterId(state), state.wordPath), checkWordAlreadyUsed(word, selectUsedWords(state))]
                    .filter(it => it.id !== '')
        },
        resetWord(state){
            resetWordState(state)
            state.wordPath = []
        },
        resetHinting(state) {
            placeLetterOnFieldState(state, { letter: '.', cell: state.lastSetLetter.id })
            state.word = []
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

            resetWordState(state)
            state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
            state.wordPath = []
        },
        removeLetter(state, action) {
            const { cell } = action.payload

            if (equals(state.lastSetLetter.id, cell)) {
                placeLetterOnFieldState(state, { letter: '.', cell })
                resetLetterState(state)
                resetWordState(state)
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

                resetWordState(state)
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

                state.word = action.payload.word.split('')
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

const commitWordState = (state, word, player) => {
    const playerWords = player === "computer" ? "wordsByComputer" : "wordsByUser"

    state[playerWords].push(word)
}

const resetWordState = (state) => state.word = []
const resetLetterState = (state) => state.lastSetLetter = { id: [-1, -1], value: '' }

const placeLetterOnFieldState = (state, { letter, cell }) => {
    const [x, y] = cell
    state.field[x][y] = letter.toUpperCase()
}

const emptyError: UserError = { id: '', messageKey: '' }

const checkWordAlreadyUsed: UserError = (word, usedWords) =>
    usedWords.includes(word) ? {id: 'WordAlreadyUsed', messageKey: 'errorWordIsAlreadyUsed'} : emptyError

const checkUsedNewLetter: UserError = (cell, path) =>
    includes(path, cell) ? emptyError : {id: 'NoNewLetterUsed', messageKey: 'errorNewLetterUnused'}

export const { resetHinting, resetLastSetLetter, setComputerWordPath, updateWord, placeLetter, removeLetter, resetWord } = gameSlice.actions

export default gameSlice.reducer
