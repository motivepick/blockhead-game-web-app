import {createAsyncThunk as createThunk, createSlice} from '@reduxjs/toolkit'
import {createNewField, makeMove} from '../api/service'
import {equals, includes} from "../common"
import type {AppDispatch} from "./store";
import type { PayloadAction } from "@reduxjs/toolkit"

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

export type GameSliceState = {
    fieldSize: number,
    difficulty: string,
    field: Field,
    uncommitedCell: Cell,
    uncommittedUserWord: Cell[],
    uncommittedComputerWord: Cell[],
    wordsByUser: string[],
    wordsByComputer: string[],
    errors: UserError[],
    status: 'IDLE' | 'PENDING' | 'SUCCEEDED' | 'FAILED',
    hinting: boolean
}

const initialState: GameSliceState = {
    fieldSize: readFieldSize(),
    difficulty: readDifficulty(),
    field: [[]] as Field,
    uncommitedCell: [-1, -1] as Cell,
    uncommittedUserWord: [] as Cell[],
    uncommittedComputerWord: [] as Cell[],
    wordsByUser: [] as string[],
    wordsByComputer: [] as string[],
    errors: [] as UserError[],
    status: 'IDLE',
    hinting: false
}

export const createAsyncThunk = createThunk.withTypes<{ state: GameSliceState, dispatch: AppDispatch }>()

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
        return gameSlice.selectors.selectWord({game: state})
    }
)

export const fetchComputerMove = createAsyncThunk(
    'moves/computer',
    async (_, {getState}) => {
        const state = getState()
        return makeMove({
            field: gameSlice.selectors.selectField({game: state}),
            usedWords: gameSlice.selectors.selectUsedWords({game: state}),
            difficulty: gameSlice.selectors.selectDifficulty({game: state})
        })
    }
)

export const fetchHint = createAsyncThunk(
    'moves/hint',
    async (_, { getState }) => {
        const state = getState()
        return makeMove({ field: gameSlice.selectors.selectField({game: state}), usedWords: gameSlice.selectors.selectUsedWords({game: state}), difficulty: 'HARD' })
    }
)

export const fetchCreateNewField = createAsyncThunk('fetchCreateNewField', async (size: Number) => createNewField(size))

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: create => ({
        updateWord: create.reducer((state, action: PayloadAction<{ cell: Cell }>) => {
            const {cell} = action.payload
            state.uncommittedUserWord.push(cell)
            const word = gameSlice.selectors.selectWord({game: state})
            state.errors =
                [checkUsedNewLetter(gameSlice.selectors.selectUncommittedCell({game: state}), state.uncommittedUserWord), checkWordAlreadyUsed(word, gameSlice.selectors.selectUsedWords({game: state}))]
                    .filter(it => it.id !== '')
        }),
        resetHinting: create.reducer((state) => {
            state.hinting = false
        }),
        // When the user requests a hint, we should clear the user's word path and, if there is an uncommitted cell, rollback it to remove it from the field,
        // only then we can fetch the hint with the actual field state.
        resetWord: create.reducer((state) => {
            state.uncommittedUserWord = []
        }),
        rollbackUncommittedCell: create.reducer((state) => {
            if (!equals(state.uncommitedCell, [-1, -1])) {
                placeLetterOnFieldState(state, { letter: '.', cell: state.uncommitedCell })
                state.uncommitedCell = [-1, -1]
            }
        }),
        // Once the computer move is fulfilled, we should commit the uncommitted cell to stop highlighting it and keep it on the field.
        commitUncommittedCell: create.reducer((state) => {
            state.uncommitedCell = [-1, -1]
        }),
        resetUncommittedComputerWord: create.reducer((state) => {
            state.uncommittedComputerWord = []
        }),
        placeLetter: create.reducer((state, action: PayloadAction<{ letter: string, cell: Cell }>) => {
            state.errors = []
            const { cell } = action.payload

            placeLetterOnFieldState(state, action.payload)

            if (!equals(state.uncommitedCell, [-1, -1])) {
                placeLetterOnFieldState(state, { letter: '.', cell: gameSlice.selectors.selectUncommittedCell({game: state}) })
            }

            state.uncommitedCell = cell
            state.uncommittedUserWord = []
        }),
        removeLetter: create.reducer((state, action: PayloadAction<{ cell: Cell }>) => {
            const { cell } = action.payload

            if (equals(state.uncommitedCell, cell)) {
                placeLetterOnFieldState(state, { letter: '.', cell })
                resetLetterState(state)
                state.errors = []
            }
        }),
    }),
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
                state.uncommittedUserWord = []
            })
            .addCase(fetchComputerMove.pending, (state) => {
                state.status = 'PENDING'
            })
            .addCase(fetchComputerMove.fulfilled, (state, action) => {
                if (state.errors.length > 0) return
                const { letter, cell } = action.payload

                placeLetterOnFieldState(state, { letter, cell })
                commitWordState(state, action.payload.word, "computer")
                state.uncommittedComputerWord = action.payload.path
                state.status = 'SUCCEEDED'
                state.uncommitedCell = cell
            })
            .addCase(fetchHint.fulfilled, (state, action) => {
                const { letter, cell } = action.payload

                state.uncommittedComputerWord = action.payload.path.map(([x, y]) => [x, y])

                placeLetterOnFieldState(state, { letter, cell })
                state.uncommitedCell = cell
                state.hinting = true
            })
            .addCase(fetchCreateNewField.pending, (state) => {
                const fieldSize = gameSlice.selectors.selectFieldSize({game: state})
                state.field = Array.from({ length: fieldSize }, () => Array.from({ length: fieldSize }, () => '.'))
            })
            .addCase(fetchCreateNewField.fulfilled, (state, action) => {
                state.field = action.payload
            })
    },
    selectors: {
        selectField: (state: GameSliceState) => state.field,
        selectUsedWords: (state: GameSliceState) => {
            const field = state.field
            return [field[Math.floor(field.length / 2)].join('')].concat(state.wordsByUser).concat(state.wordsByComputer);
        },
        selectUncommittedCell: (state: GameSliceState): Cell => state.uncommitedCell,
        selectWord: (state: GameSliceState): string => {
            const field = state.field
            return state.uncommittedUserWord.map(([x, y]) => field[x][y]).join('')
        },
        selectUncommittedUserWord: (state: GameSliceState): Cell[] => state.uncommittedUserWord,
        selectUncommittedComputerWord: (state: GameSliceState): Cell[] => state.uncommittedComputerWord,
        selectStatus: (state: GameSliceState): string => state.status,
        selectFieldSize: (state: GameSliceState): number => state.fieldSize,
        selectDifficulty: (state: GameSliceState): string => state.difficulty,
        selectHinting: (state: GameSliceState): boolean => state.hinting,
        selectWordsByUser: (state: GameSliceState): string[] => state.wordsByUser,
        selectWordsByComputer: (state: GameSliceState): string[] => state.wordsByComputer,
        selectErrors: (state: GameSliceState): UserError[] => state.errors
    }
})

const commitWordState = (state: GameSliceState, word: string, player: string) => {
    if (player === "computer") {
        state.wordsByComputer.push(word)
    } else {
        state.wordsByUser.push(word)
    }
}

const resetLetterState = (state: GameSliceState) =>
    state.uncommitedCell = [-1, -1]

const placeLetterOnFieldState = (state: GameSliceState, { letter, cell }: {letter: string, cell: Cell}) => {
    const [x, y] = cell
    state.field[x][y] = letter.toUpperCase()
}

const emptyError: UserError = { id: '', messageKey: '' }

const checkWordAlreadyUsed = (word: string, usedWords: string[]): UserError =>
    usedWords.includes(word) ? {id: 'WordAlreadyUsed', messageKey: 'errorWordIsAlreadyUsed'} : emptyError

const checkUsedNewLetter = (cell: Cell, path: Cell[]): UserError =>
    includes(path, cell) ? emptyError : {id: 'NoNewLetterUsed', messageKey: 'errorNewLetterUnused'}

export const { resetHinting, rollbackUncommittedCell, commitUncommittedCell, resetUncommittedComputerWord, updateWord, placeLetter, removeLetter, resetWord } = gameSlice.actions

export const { selectField, selectUsedWords, selectUncommittedCell, selectWord, selectUncommittedUserWord, selectUncommittedComputerWord, selectStatus, selectFieldSize, selectDifficulty, selectHinting, selectWordsByUser, selectWordsByComputer, selectErrors } = gameSlice.selectors

export default gameSlice.reducer
