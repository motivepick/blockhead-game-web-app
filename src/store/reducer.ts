// @ts-nocheck
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { makeMove, createNewField } from '../api/service'
import {selectDifficulty, selectField, selectFieldSize, selectLastSetLetterId, selectWordsUsed} from "./selectors";

const cyrillicAlphabet = /^\p{Script=Cyrillic}+$/u

const initialState = {
    fieldSize: 5,
    difficulty: 'Medium',
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
    status: 'IDLE'
}

export const fetchComputerMove = createAsyncThunk(
    'moves/computer',
    async (word, { getState }) => {
        const state = getState()
        return makeMove({ field: selectField(state), wordsUsed: selectWordsUsed(state), difficulty: selectDifficulty(state) })
    }
)

export const fetchHint = createAsyncThunk(
    'moves/user',
    async (word, { getState }) => {
        const state = getState()
        return makeMove({ field: selectField(state), wordsUsed: selectWordsUsed(state), difficulty: 'Hard' })
    }
)

export const fetchCreateNewField = createAsyncThunk('fetchCreateNewField', async (size: Number) => createNewField(size))

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setDifficulty(state, action) {
            const { difficulty } = action.payload
            state.difficulty = difficulty
        },
        setFieldSize(state, action) {
            const { fieldSize } = action.payload
            state.fieldSize = fieldSize
        },
        setComputerWordPath(state, {payload}) {
            state.computerWordPath = payload
        },
        updateWord(state, action) {
            const { letter, cell } = action.payload
            state.word.push(letter)
            state.wordPath.push(cell)
        },
        resetWord(state){
            resetWordState(state)
            state.wordPath = []
        },
        userMove(state) {
            const word = state.word.join('')

            checkForErrors(state, checkWordAlreadyUsed, [word, state.wordsUsed])
            checkForErrors(state, checkUsedNewLetter, [selectLastSetLetterId(state), state.wordPath])

            if (state.errors.length > 0) return

            commitWordState(state, word, "user")

            resetWordState(state)
            resetLetterState(state)
            state.wordPath = []
        },
        placeLetter(state, action) {
            state.errors = []
            const { letter, cell } = action.payload

            checkForErrors(state, checkAlphabet, letter)

            placeLetterOnFieldState(state, action.payload)

            if (state.lastSetLetter.id !== '') {
                placeLetterOnFieldState(state, { letter: '.', cell: selectLastSetLetterId(state) })
            }

            resetWordState(state)
            state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
            state.wordPath = []

            checkForErrors(state, checkLetterPlacedNearText, [cell, state.field])
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
            .addCase(fetchComputerMove.pending, (state) => {
                state.status = 'PENDING'
            })
            .addCase(fetchComputerMove.fulfilled, (state, action) => {
                if (state.errors.length > 0) return
                const { letter, cell } = action.payload

                placeLetterOnFieldState(state, { letter, cell: `${cell[0]}_${cell[1]}` })
                commitWordState(state, action.payload.word, "computer")
                state.computerWordPath = action.payload.path.map(([x, y]) => `${x}_${y}`)
                state.status = 'SUCCEEDED'
            })
            .addCase(fetchHint.fulfilled, (state, action) => {
                const { letter, cell } = action.payload
                const id = `${cell[0]}_${cell[1]}`

                state.word = action.payload.word.split('')
                state.computerWordPath = action.payload.path.map(([x, y]) => `${x}_${y}`)

                placeLetterOnFieldState(state, { letter, cell: id })
                state.lastSetLetter = { id, value: letter.toUpperCase() }
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
    },
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

const checkForErrors = (state, checkError, params) => {
    const error = checkError(...params)
    if(error.id) {
        state.errors.push(error)
    }
}

const emptyError = { id: '', message: '' }

const checkAlphabet = letter => !letter.match(cyrillicAlphabet) ? { id: 'WrongAlphabet', message: 'Letter should be from the alphabet' } : emptyError
const checkLetterPlacedNearText = (cell, field) => {
    const [x, y] = cell.split('_').map(i => Number(i))
    const directions = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
    const hasLetterInAdjacentCell = directions
        .map(([xi, yi]) => field[xi]?.[yi])
        .some(letter => letter !== '.' && letter !== undefined)

    return !hasLetterInAdjacentCell ? { id: 'LetterFarFromAnyText', message: 'Place the letter near another letter' } : emptyError
}
const checkWordAlreadyUsed = (word, usedWords) => usedWords.includes(word) ? { id: 'WordAlreadyUsed', message: 'Word is already used' } : emptyError
const checkUsedNewLetter = (cell, path) => !path.includes(cell) ? { id: 'NoNewLetterUsed', message: 'Use new letter' } : emptyError

export const { setDifficulty, setFieldSize, setComputerWordPath, userMove, updateWord, placeLetter, removeLetter, resetWord } = gameSlice.actions

export default gameSlice.reducer
