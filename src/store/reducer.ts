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
            const { letter } = action.payload
            state.word.push(letter)
        },
        resetWord(state, action) {
            state.word = []
        },
        userMove(state, action) {
            const { word } = action.payload

            state.word = []
            state.lastSetLetter = { id: '', value: '' }
            state.wordsUsed.push(word)
            state.wordsByUser.push(word)
            state.scoreByUser += word.length
        },
        placeLetter(state, action) {
            const { letter, cell } = action.payload

            if (!letter.match(cyrillicAlphabet)) {
                state.error = 'Letter should be from the alphabet'
            } else {
                state.error = false
            }

            const [x, y] = cell
            state.field[x][y] = letter.toUpperCase()

            if (state.lastSetLetter.id !== '') {
                const [xi, yi] = state.lastSetLetter.id
                state.field[xi][yi] = '.'
            }

            state.word = []
            state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
        },
        removeLetter(state, action) {
            const { cell } = action.payload

            if (state.lastSetLetter.id === cell) {
                const [x, y] = cell
                state.field[x][y] = '.'
                state.lastSetLetter = { id: '', value: '' }
                state.word = []
                state.error = false
            }
        },
        computerMove(state, action) {
            const { word, letter, cell } = action.payload

            const [x, y] = cell
            state.field[x][y] = letter.toUpperCase()

            state.wordsUsed.push(word)
            state.wordsByComputer.push(word)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComputerMove.fulfilled, (state, action) => {
                const { word, letter, cell } = action.payload

                const [x, y] = cell
                state.field[x][y] = letter.toUpperCase()

                state.wordsUsed.push(word)
                state.wordsByComputer.push(word)
                state.scoreByComputer += word.length
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

export const { userMove, updateWord, placeLetter, removeLetter, resetWord, clearBeforeHint } = gameSlice.actions

export default gameSlice.reducer

export const selectAll = (state: RootState) => state
