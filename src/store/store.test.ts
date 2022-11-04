import actions from './actions'
import reducer from './reducer'

describe('reducer', () => {
    test('should update word', () => {
        const state = { word: [] }
        const action = { type: actions.UPDATE_WORD, letter: 'I' }

        const updatedState = reducer(state, action)

        expect(updatedState).toEqual({ word: ['I'] })
    })

    test('should reset word', () => {
        const state = { word: [] }
        const action = { type: actions.RESET_WORD }

        const updatedState = reducer(state, action)

        expect(updatedState).toEqual({ word: [] })
    })

    test('should not add empty word to usedWords', () => {
        const state = { word: [], lastSetLetter: { id: '', value: '' }, wordsUsed: [], wordsByUser: [] }
        const action = { type: actions.USER_MOVE }

        const updatedState = reducer(state, action)

        expect(updatedState).toEqual({ word: [], lastSetLetter: { id: '', value: '' }, wordsUsed: [], wordsByUser: [] })
    })
})