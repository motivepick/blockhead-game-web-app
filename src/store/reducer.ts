// @ts-nocheck
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { makeMove, createNewField } from '../api/service'
import { RootState } from './store'

const cyrillicAlphabet = /^\p{Script=Cyrillic}+$/u

const initialState = {
    field: [[]],
    fieldSize: 0,
    lastSetLetter: { id: '', value: '' },
    word: [],
    wordPath: [],
    wordsUsed: [],
    wordsByUser: [],
    wordsByComputer: [],
    scoreByUser: 0,
    scoreByComputer: 0,
    error: false
}

export const fetchComputerMove = createAsyncThunk(
    'moves/computer',
    async (word, { getState }) => {
        const { field, wordsUsed } = getState()
        return makeMove({ field, wordsUsed })
    }
)

export const fetchCreateNewField = createAsyncThunk('fetchCreateNewField', async (size: Number) => createNewField(size))

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateWord(state, action) {
            const { letter, cell } = action.payload
            state.word.push(letter)
            state.wordPath.push(cell)
        },
        resetWord(state, action){
            resetWordState(state)
            state.wordPath = []
        },
        userMove(state, action) {
            commitWordState(state, state.word.join(''), "user")

            resetWordState(state)
            resetLetterState(state)
        },
        placeLetter(state, action) {
            const { letter, cell } = action.payload

            state.error = checkAlphabet(letter)

            placeLetterOnFieldState(state, action.payload)

            if (state.lastSetLetter.id !== '') {
                placeLetterOnFieldState(state, { letter: '.', cell: state.lastSetLetter.id })
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
                state.error = false
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComputerMove.fulfilled, (state, action) => {
                const { letter, cell } = action.payload

                placeLetterOnFieldState(state, { letter, cell: `${cell[0]}_${cell[1]}` })
                commitWordState(state, action.payload.word, "computer")
                state.wordPath = action.payload.path.map(([x, y]) => `${x}_${y}`)
            })
            .addCase(fetchCreateNewField.fulfilled, (state, action) => {
                const field = action.payload
                const word = field[Math.floor(field.length / 2)].join('')

                state.field = field
                state.fieldSize = field.length
                state.wordsUsed.push(word)
            })
    },
})

const commitWordState = (state, word, player) => {
    const playerWords = player == "computer" ? "wordsByComputer" : "wordsByUser"
    const playerScore = player == "computer" ? "scoreByComputer" : "scoreByUser"

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

const checkAlphabet = letter => !letter.match(cyrillicAlphabet) ? 'Letter should be from the alphabet' : ''

export const { userMove, updateWord, placeLetter, removeLetter, resetWord } = gameSlice.actions

export default gameSlice.reducer

export const selectAll = (state: RootState) => state
