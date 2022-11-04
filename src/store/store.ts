// @ts-nocheck
import actions from './actions'

const store = (state, dispatch) => ({
    field: state.field,
    lastSetLetter: state.lastSetLetter,
    word: state.word,
    wordsUsed: state.wordsUsed,
    wordsByUser: state.wordsByUser,
    wordsByComputer: state.wordsByComputer,
    createNewField: (field) => {
        dispatch({ type: actions.CREATE_NEW_FIELD, field })
    },
    placeLetter: (letter, cell) => {
        dispatch({ type: actions.PLACE_LETTER, letter, cell })
    },
    updateWord: (letter) => {
        dispatch({ type: actions.UPDATE_WORD, letter })
    },
    resetWord: () => {
        dispatch({ type: actions.RESET_WORD })
    },
    userMakesAMove: (word) => {
        dispatch({ type: actions.USER_MOVE, word })
    },
    computerMakesAMove: (word, letter, cell) => {
        dispatch({ type: actions.COMPUTER_MOVE, word, letter, cell })
    },
})

export default store