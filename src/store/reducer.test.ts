// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import reducer, { submitUserMove } from './reducer'

describe('reducer', () => {
    // const initialState: CounterState = {
    //   value: 3,
    //   status: 'idle',
    // };
    const initialState = {
        field: [[]],
        lastSetLetter: { id: '', value: '' },
        word: [],
        wordsByUser: ['word1', 'word4'],
        wordsByComputer: ['word2', 'word3']
    }

    it('should handle initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual({
            field: [[]],
            lastSetLetter: { id: '', value: '' },
            word: [],
            wordsByUser: [],
            wordsByComputer: []
        })
    })
    describe('submitUserMove', () => {
        it('should handle submitUserMove', () => {
            const actual = reducer(initialState, submitUserMove({ word: 'ABC' }))
            expect(actual.wordsByUser.at(-1)).toEqual('ABC')
            expect(actual.wordsByUser.at(-1)).toEqual('ABC')
        })
        it('should not accept already used word', () => {
            const actual = reducer(initialState, submitUserMove({ word: 'word3' }))
            expect(actual.wordsByUser.length).toEqual(initialState.wordsByUser.length)
            expect(actual.error).toEqual('Word already used')
        })
        // eslint-disable-next-line vitest/expect-expect
        it('should use new letter in new word', () => {
            /* empty */
        })
    })
})
