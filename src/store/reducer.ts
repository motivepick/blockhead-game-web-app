// @ts-nocheck
import actions from './actions'

const reducer = (state, action) => {
    switch (action.type) {
        case actions.UPDATE_WORD: {
            const { letter } = action

            return Object.assign({}, state, {
                word: [...state.word, letter]
            })
        }
        case actions.RESET_WORD: {
            return Object.assign({}, state, {
                word: []
            })
        }
        case actions.USER_MOVE: {
            const { word } = action

            return Object.assign({}, state, {
                word: [],
                lastSetLetter: { id: '', value: '' },
                wordsUsed: [...state.wordsUsed, word],
                wordsByUser: [...state.wordsByUser, word]
            })
        }
        case actions.PLACE_LETTER: {
            const { letter, cell } = action

            const [x, y] = cell
            const updatedField = [...state.field]
            updatedField[x][y] = letter.toUpperCase()

            if (state.lastSetLetter.id !== '') {
                const [xi, yi] = state.lastSetLetter.id
                updatedField[xi][yi] = '.'
            }

            return Object.assign({}, state, {
                field: updatedField,
                lastSetLetter: { id: cell, value: letter.toUpperCase() }
            })
        }
        case actions.COMPUTER_MOVE: {
            const { word, letter, cell } = action

            const [x, y] = cell
            const updatedField = [...state.field]
            updatedField[x][y] = letter.toUpperCase()

            return Object.assign({}, state, {
                field: updatedField,
                wordsUsed: [...state.wordsUsed, word],
                wordsByComputer: [...state.wordsByComputer, word]
            })
        }
        default:
            return state
    }
}

export default reducer