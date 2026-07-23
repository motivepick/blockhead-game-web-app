import { fireEvent } from '@testing-library/react'
import type { GameSliceState } from '../../store/reducer'
import { selectUncommittedUserWord } from '../../store/reducer'
import { renderWithProviders } from '../../utils/test-utils'
import Board from '../Board'

test('does not allow selecting a cell already in the current word', () => {
    const initialState: GameSliceState = {
        fieldSize: 3,
        difficulty: 'MEDIUM',
        field: [
            ['.', '.', '.'],
            ['A', 'B', 'C'],
            ['.', '.', '.']
        ],
        uncommitedCell: [1, 0],
        uncommittedUserWord: [
            [1, 0],
            [1, 1]
        ],
        uncommittedComputerWord: [],
        wordsByUser: [],
        wordsByComputer: [],
        errors: [],
        status: 'IDLE',
        hinting: false
    }

    const { container, store } = renderWithProviders(<Board onSubmitWord={vi.fn()} />, {
        preloadedState: { game: initialState }
    })
    const selectedCell = container.querySelector<HTMLElement>('[id="1_0"]')

    if (!selectedCell) throw new Error('Expected selected cell to be rendered')

    expect(selectedCell).not.toHaveClass('board-cell--selectable')

    fireEvent.click(selectedCell)

    expect(selectUncommittedUserWord(store.getState())).toStrictEqual([
        [1, 0],
        [1, 1]
    ])
})
