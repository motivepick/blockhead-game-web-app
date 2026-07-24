import api from '../../api/service'
import type { GameSliceState } from '../reducer'
import {
    createInitialState,
    fetchComputerMove,
    fetchCreateNewField,
    placeLetter,
    submitUserMove,
    updateWord
} from '../reducer'
import { SAVED_GAME_STORAGE_KEY } from '../persistence'
import { makeStore } from '../store'

const field: Field = [
    ['.', '.', '.'],
    ['C', 'A', 'T'],
    ['.', '.', '.']
]

const createState = (overrides: Partial<GameSliceState> = {}): GameSliceState => ({
    fieldSize: 3,
    difficulty: 'MEDIUM',
    field,
    uncommitedCell: [-1, -1],
    uncommittedUserWord: [],
    uncommittedComputerWord: [],
    wordsByUser: [],
    wordsByComputer: [],
    errors: [],
    status: 'IDLE',
    hinting: false,
    ...overrides
})

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    vi.restoreAllMocks()
})

test('restores a completed game and discards transient move state', () => {
    localStorage.setItem('fieldSize', JSON.stringify(3))
    localStorage.setItem(
        SAVED_GAME_STORAGE_KEY,
        JSON.stringify({
            version: 1,
            fieldSize: 3,
            field,
            wordsByUser: ['SC'],
            wordsByComputer: ['DT']
        })
    )

    const state = createInitialState()

    expect(state.field).toStrictEqual(field)
    expect(state.wordsByUser).toStrictEqual(['SC'])
    expect(state.wordsByComputer).toStrictEqual(['DT'])
    expect(state.uncommitedCell).toStrictEqual([-1, -1])
    expect(state.uncommittedUserWord).toStrictEqual([])
    expect(state.uncommittedComputerWord).toStrictEqual([])
})

test('saves only after the computer completes the turn', async () => {
    const store = makeStore({ game: createState() })
    vi.spyOn(api, 'makeMove').mockResolvedValue({
        cell: [2, 2],
        letter: 'D',
        path: [
            [2, 2],
            [1, 2]
        ],
        word: 'DT',
        success: true
    })

    store.dispatch(placeLetter({ cell: [0, 0], letter: 'S' }))
    store.dispatch(updateWord({ cell: [0, 0] }))
    store.dispatch(updateWord({ cell: [1, 0] }))
    await store.dispatch(submitUserMove())

    expect(localStorage.getItem(SAVED_GAME_STORAGE_KEY)).toBeNull()

    await store.dispatch(fetchComputerMove())

    await vi.waitFor(() => {
        expect(JSON.parse(localStorage.getItem(SAVED_GAME_STORAGE_KEY) ?? '')).toStrictEqual({
            version: 1,
            fieldSize: 3,
            field: [
                ['S', '.', '.'],
                ['C', 'A', 'T'],
                ['.', '.', 'D']
            ],
            wordsByUser: ['SC'],
            wordsByComputer: ['DT']
        })
    })
})

test('starting a new game clears progress and replaces the saved game', async () => {
    const newField: Field = [
        ['.', '.', '.'],
        ['N', 'E', 'W'],
        ['.', '.', '.']
    ]
    const store = makeStore({
        game: createState({
            uncommitedCell: [0, 0],
            uncommittedUserWord: [
                [0, 0],
                [1, 0]
            ],
            wordsByUser: ['SC'],
            wordsByComputer: ['DT']
        })
    })
    vi.spyOn(api, 'createNewField').mockResolvedValue(newField)

    await store.dispatch(fetchCreateNewField(3))

    expect(store.getState().game).toMatchObject({
        field: newField,
        uncommitedCell: [-1, -1],
        uncommittedUserWord: [],
        uncommittedComputerWord: [],
        wordsByUser: [],
        wordsByComputer: [],
        errors: [],
        status: 'IDLE',
        hinting: false
    })

    await vi.waitFor(() => {
        expect(JSON.parse(localStorage.getItem(SAVED_GAME_STORAGE_KEY) ?? '')).toMatchObject({
            field: newField,
            wordsByUser: [],
            wordsByComputer: []
        })
    })
})
