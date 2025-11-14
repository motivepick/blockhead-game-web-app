import type { GameSliceState } from '../reducer.ts'
import { gameSlice, selectDifficulty, selectFieldSize, setDifficulty, setFieldSize } from '../reducer.ts'
import type { AppStore } from '../store.ts'
import { makeStore } from '../store.ts'

type LocalTestContext = {
    store: AppStore
}

describe('counter reducer', () => {
    beforeEach<LocalTestContext>(context => {
        const initialState: GameSliceState = {
            fieldSize: 5,
            difficulty: 'MEDIUM',
            field: [[]],
            uncommitedCell: [-1, -1],
            uncommittedUserWord: [],
            uncommittedComputerWord: [],
            wordsByUser: [],
            wordsByComputer: [],
            errors: [],
            status: 'IDLE',
            hinting: false
        }

        context.store = makeStore({ game: initialState })
    })

    it('should handle initial state', () => {
        expect(gameSlice.reducer(undefined, { type: 'unknown' })).toStrictEqual({
            fieldSize: 5,
            difficulty: 'MEDIUM',
            field: [[]],
            uncommitedCell: [-1, -1],
            uncommittedUserWord: [],
            uncommittedComputerWord: [],
            wordsByUser: [],
            wordsByComputer: [],
            errors: [],
            status: 'IDLE',
            hinting: false
        })
    })

    it<LocalTestContext>('should set difficulty', async ({ store }) => {
        expect(selectDifficulty(store.getState())).toBe('MEDIUM')

        await store.dispatch(setDifficulty('EASY'))

        expect(selectDifficulty(store.getState())).toBe('EASY')
    })

    it<LocalTestContext>('should set field size', async ({ store }) => {
        expect(selectFieldSize(store.getState())).toBe(5)

        await store.dispatch(setFieldSize(3))

        expect(selectFieldSize(store.getState())).toBe(3)
    })
})
