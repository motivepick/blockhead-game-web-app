import { screen } from '@testing-library/react'
import { App } from '../App.tsx'
import type { GameSliceState } from '../store/reducer.ts'
import { renderWithProviders } from '../utils/test-utils.tsx'
import api from '../api/service.ts'
import i18n from '../i18n.ts'

const field: Field = [
    ['.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.'],
    ['W', 'O', 'R', 'D', 'S'],
    ['.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.']
]

const createState = (overrides: Partial<GameSliceState> = {}): GameSliceState => ({
    fieldSize: 5,
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

beforeEach(async () => {
    await i18n.changeLanguage('en')
})

afterEach(() => {
    vi.restoreAllMocks()
})

test('App should have correct initial render', () => {
    renderWithProviders(<App />, { preloadedState: { game: createState() } })

    expect(screen.getAllByRole('textbox')).toHaveLength(20)
    expect(screen.getByRole('button', { name: 'New game' })).toBeInTheDocument()
})

test('asks for confirmation before replacing a game with progress', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const createNewField = vi.spyOn(api, 'createNewField')
    const { user } = renderWithProviders(<App />, {
        preloadedState: {
            game: createState({
                wordsByUser: ['WORD'],
                wordsByComputer: ['WORDS']
            })
        }
    })

    await user.click(screen.getByRole('button', { name: 'New game' }))

    expect(confirm).toHaveBeenCalledOnce()
    expect(createNewField).not.toHaveBeenCalled()
})

test('asks for confirmation before changing the board size with progress', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { user } = renderWithProviders(<App />, {
        preloadedState: {
            game: createState({
                wordsByUser: ['WORD'],
                wordsByComputer: ['WORDS']
            })
        }
    })
    const boardSize = screen.getByLabelText('Board size')

    await user.selectOptions(boardSize, '3')

    expect(confirm).toHaveBeenCalledOnce()
    expect(boardSize).toHaveValue('5')
})

test('disables hints when the field is full', () => {
    renderWithProviders(<App />, {
        preloadedState: {
            game: createState({
                field: [
                    ['A', 'B', 'C', 'D', 'E'],
                    ['F', 'G', 'H', 'I', 'J'],
                    ['K', 'L', 'M', 'N', 'O'],
                    ['P', 'Q', 'R', 'S', 'T'],
                    ['U', 'V', 'W', 'X', 'Y']
                ]
            })
        }
    })

    expect(screen.getByRole('button', { name: 'Hint' })).toBeDisabled()
})
