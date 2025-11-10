import {FC, useEffect, useState} from 'react'
import './Board.css'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {
    placeLetter,
    removeLetter,
    resetHinting,
    commitUncommittedCell,
    resetUncommittedComputerWord,
    updateWord,
    rollbackUncommittedCell
} from '../store/reducer'
import Cell from './Cell'
import {
    selectUncommittedComputerWord,
    selectField,
    selectFieldSize,
    selectHinting,
    selectUncommittedCell,
    selectStatus,
    selectUncommittedUserWord
} from "../store/reducer"
import {equals, includes} from "../common"

type Props = {
    onSubmitWord: () => void
}

const COMPUTER_MOVE_HIGHLIGHT_DELAY_MS = 300
const COMPUTER_MOVE_HINT_HIGHLIGHT_DELAY_MS = 400

const adjacentCells = (i: number, j: number): Cell[] => [
    [i - 1, j],
    [i + 1, j],
    [i, j - 1],
    [i, j + 1]
]

const hasLetterInAdjacentCell = (i: number, j: number, field: string[][]): boolean =>
    adjacentCells(i, j).some(([x, y]) => field[x]?.[y] && field[x][y] !== '.')

const isAdjacentToLastSelectedCell = (i: number, j: number, uncommittedUserWord: Cell[]): boolean => {
    if (uncommittedUserWord.length) {
        const lastSelectedCell = uncommittedUserWord[uncommittedUserWord.length - 1]
        return includes(adjacentCells(i, j), lastSelectedCell)
    } else {
        return false
    }
};

const latinToCyrillicMap: Record<string, string> = {
    'Q': 'Й',
    'W': 'Ц',
    'E': 'У',
    'R': 'К',
    'T': 'Е',
    'Y': 'Н',
    'U': 'Г',
    'I': 'Ш',
    'O': 'Щ',
    'P': 'З',
    '[': 'Х',
    ']': 'Ъ',
    'A': 'Ф',
    'S': 'Ы',
    'D': 'В',
    'F': 'А',
    'G': 'П',
    'H': 'Р',
    'J': 'О',
    'K': 'Л',
    'L': 'Д',
    ';': 'Ж',
    '\'': 'Э',
    'Z': 'Я',
    'X': 'Ч',
    'C': 'С',
    'V': 'М',
    'B': 'И',
    'N': 'Т',
    'M': 'Ь',
    ',': 'Б',
    '.': 'Ю'
}

const mapToAlphabet = (letter: string): string => {
    const upperCaseLetter = letter.toUpperCase();
    return latinToCyrillicMap[upperCaseLetter as keyof Record<string, string>] || upperCaseLetter;
}

const Board: FC<Props> = (props) => {
    const { onSubmitWord } = props
    const field = useAppSelector(selectField)
    const fieldSize = useAppSelector(selectFieldSize)
    const uncommittedUserWord = useAppSelector(selectUncommittedUserWord)
    const uncommittedComputerWord = useAppSelector(selectUncommittedComputerWord)
    const computerWordPathLength = uncommittedComputerWord.length
    const uncommittedCell = useAppSelector(selectUncommittedCell)
    const status = useAppSelector(selectStatus)
    const hinting = useAppSelector(selectHinting)
    const dispatch = useAppDispatch()

    const onPlaceLetter = (cell: Cell, letter: string) => dispatch(placeLetter({
        letter: mapToAlphabet(letter),
        cell
    }))

    const [index, setIndex] = useState(0)

    const onResetLetter = (cell: Cell) => {
        dispatch(removeLetter({cell}))
    }

    useEffect(() => {
        if (index === computerWordPathLength) {
            if (hinting) {
                dispatch(resetHinting())
                dispatch(rollbackUncommittedCell())
            }
            setIndex(0)
            dispatch(commitUncommittedCell())
            dispatch(resetUncommittedComputerWord())
        } else {
            const highlightNextCell = setTimeout(() => {
                setIndex(index => index + 1)
            }, hinting ? COMPUTER_MOVE_HINT_HIGHLIGHT_DELAY_MS : COMPUTER_MOVE_HIGHLIGHT_DELAY_MS);
            return () => clearTimeout(highlightNextCell);
        }
    }, [dispatch, hinting, computerWordPathLength, index])

    return (
        <div className="board-container bg-black dark:bg-gray-900"> {/* Change Board.css if changing bg-gray-900. */}
            <div
                className="grid"
                style={{gridTemplateColumns: `repeat(${fieldSize}, minmax(0, 1fr))`}}
            >
                {
                    field.flatMap((row, i) => row.map((l, j) =>
                        <Cell
                            key={`${i}_${j}`}
                            id={`${i}_${j}`}
                            highlightPrimary={equals(uncommittedCell, [i, j])}
                            highlightSecondary={includes(uncommittedUserWord, [i, j]) || includes(uncommittedComputerWord.slice(0, index + 1), [i, j])}
                            value={l}
                            editable={status !== 'PENDING' && uncommittedComputerWord.length === 0 && equals(uncommittedCell, [-1, -1]) && hasLetterInAdjacentCell(i, j, field)}
                            selectable={status !== 'PENDING' && uncommittedComputerWord.length === 0 && !equals(uncommittedCell, [-1, -1]) && (uncommittedUserWord.length === 0 || isAdjacentToLastSelectedCell(i, j, uncommittedUserWord))}
                            onSelectWord={() => dispatch(updateWord({cell: [i, j]}))}
                            onSubmitWord={onSubmitWord}
                            onResetLetter={onResetLetter}
                            onChange={onPlaceLetter}
                        />))
                }
            </div>
        </div>
    )
}

export default Board
