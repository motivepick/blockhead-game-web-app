// @ts-nocheck
import reducer, {
    userMove
} from './reducer'

describe('reducer', () => {
    // const initialState: CounterState = {
    //   value: 3,
    //   status: 'idle',
    // };
    const initialState = {
        field: [[]],
        lastSetLetter: { id: '', value: '' },
        word: [],
        wordsUsed: ['word1', 'word2', 'word3', 'word4'],
        wordsByUser: ['word1', 'word4'],
        wordsByComputer: ['word2', 'word3']
    }

    it('should handle initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({
            field: [[]],
            lastSetLetter: { id: '', value: '' },
            word: [],
            wordsUsed: [],
            wordsByUser: [],
            wordsByComputer: []
        })
    })
    describe('userMove', () => {
        it('should handle userMove', () => {
            const actual = reducer(initialState, userMove({ word: 'ABC' }))
            expect(actual.wordsUsed.length).toEqual(initialState.wordsUsed.length + 1)
            expect(actual.wordsByUser.at(-1)).toEqual('ABC')
            expect(actual.wordsUsed.at(-1)).toEqual('ABC')
        })
        it('should not accept already used word', () => {
            const actual = reducer(initialState, userMove({ word: 'word3' }))
            expect(actual.wordsUsed.length).toEqual(initialState.wordsUsed.length)
            expect(actual.wordsByUser.length).toEqual(initialState.wordsByUser.length)
            expect(actual.error).toEqual('Word already used')
        })
        it('should use new letter in new word', () => {})
    })
})
