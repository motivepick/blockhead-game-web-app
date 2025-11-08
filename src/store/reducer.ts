// @ts-nocheck
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {createNewField, makeMove} from '../api/service'
import {selectDifficulty, selectField, selectFieldSize, selectLastSetLetterId, selectWordsUsed} from "./selectors";

const readFieldSize = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem('fieldSize'));
        console.log('parsed field size', parsed)
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
    lastSetLetter: { id: '', value: '' },
    word: [],
    wordPath: [],
    computerWordPath: [],
    wordsUsed: [],
    wordsByUser: [],
    wordsByComputer: [],
    scoreByUser: 0,
    scoreByComputer: 0,
    errors: [],
    status: 'IDLE',
    hinting: false
}

export const setDifficulty = createAsyncThunk(
    'game/difficulty',
    async (difficulty) => {
        localStorage.setItem('difficulty', JSON.stringify(difficulty))
        return difficulty
    }
)

export const setFieldSize = createAsyncThunk(
    'game/fieldSize',
    async (fieldSize) => {
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
        return makeMove({ field: selectField(state), wordsUsed: selectWordsUsed(state), difficulty: selectDifficulty(state) })
    }
)

export const fetchHint = createAsyncThunk(
    'moves/hint',
    async (word, { getState }) => {
        const state = getState()
        return makeMove({ field: selectField(state), wordsUsed: selectWordsUsed(state), difficulty: 'HARD' })
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
                [checkUsedNewLetter(selectLastSetLetterId(state), state.wordPath), checkWordAlreadyUsed(word, state.wordsUsed)]
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
            state.lastSetLetter = {id: '', value: ''}
        },
        placeLetter(state, action) {
            state.errors = []
            const { letter, cell } = action.payload

            placeLetterOnFieldState(state, action.payload)

            if (state.lastSetLetter.id !== '') {
                placeLetterOnFieldState(state, { letter: '.', cell: selectLastSetLetterId(state) })
            }

            resetWordState(state)
            state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
            state.wordPath = []
        },
        removeLetter(state, action) {
            const { cell } = action.payload

            if (state.lastSetLetter.id === cell) {
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

                const id = `${cell[0]}_${cell[1]}`
                placeLetterOnFieldState(state, { letter, cell: id })
                commitWordState(state, action.payload.word, "computer")
                state.computerWordPath = action.payload.path.map(([x, y]) => `${x}_${y}`)
                state.status = 'SUCCEEDED'
                state.lastSetLetter = { id: id, value: letter.toUpperCase() }
            })
            .addCase(fetchHint.fulfilled, (state, action) => {
                const { letter, cell } = action.payload
                const id = `${cell[0]}_${cell[1]}`

                state.word = action.payload.word.split('')
                state.computerWordPath = action.payload.path.map(([x, y]) => `${x}_${y}`)

                placeLetterOnFieldState(state, { letter, cell: id })
                state.lastSetLetter = { id, value: letter.toUpperCase() }
                state.hinting = true
            })
            .addCase(fetchCreateNewField.pending, (state) => {
                const fieldSize = selectFieldSize(state)
                state.field = Array.from({ length: fieldSize }, () => Array.from({ length: fieldSize }, () => '.'))
            })
            .addCase(fetchCreateNewField.fulfilled, (state, action) => {
                const field = action.payload
                const word = field[Math.floor(field.length / 2)].join('')

                state.field = field
                state.wordsUsed.push(word)
            })
    }
})

const commitWordState = (state, word, player) => {
    const playerWords = player === "computer" ? "wordsByComputer" : "wordsByUser"
    const playerScore = player === "computer" ? "scoreByComputer" : "scoreByUser"

    state.wordsUsed.push(word)
    state[playerWords].push(word)
    state[playerScore] += word.length
}

const resetWordState = (state) => state.word = []
const resetLetterState = (state) => state.lastSetLetter = { id: '', value: '' }

const placeLetterOnFieldState = (state, { letter, cell }) => {
    const [x, y] = cell.split('_')
    state.field[x][y] = letter.toUpperCase()
}

const emptyError = { id: '', message: '' }

const checkWordAlreadyUsed = (word, usedWords) =>
    usedWords.includes(word) ? {id: 'WordAlreadyUsed', messageKey: 'errorWordIsAlreadyUsed'} : emptyError

const checkUsedNewLetter = (cell, path) =>
    path.includes(cell) ? emptyError : {id: 'NoNewLetterUsed', messageKey: 'errorNewLetterUnused'}

export const { resetHinting, resetLastSetLetter, setComputerWordPath, updateWord, placeLetter, removeLetter, resetWord } = gameSlice.actions

export default gameSlice.reducer
