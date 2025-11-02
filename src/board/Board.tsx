import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react'
import './Board.css'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {
    placeLetter,
    removeLetter,
    resetHinting,
    resetLastSetLetter,
    setComputerWordPath,
    updateWord
} from '../store/reducer'
import Cell from './Cell'
import {
    selectComputerWordPath,
    selectComputerWordPathLength,
    selectField,
    selectFieldSize,
    selectHinting,
    selectLastSetLetterId,
    selectStatus,
    selectWordPath
} from "../store/selectors"

const COMPUTER_MOVE_HIGHLIGHT_DELAY_MS = 300
const COMPUTER_MOVE_HINT_HIGHLIGHT_DELAY_MS = 400

const adjacentCells = (i: number, j: number) => [
    [i - 1, j],
    [i + 1, j],
    [i, j - 1],
    [i, j + 1]
]

const hasLetterInAdjacentCell = (i: number, j: number, field: string[][]): boolean =>
    adjacentCells(i, j).some(([x, y]) => field[x]?.[y] && field[x][y] !== '.')

const isAdjacentToLastSelectedCell = (i: number, j: number, wordPath: string[]): boolean => {
    if (wordPath.length) {
        const lastSelectedCellId = wordPath[wordPath.length - 1]
        const [x, y] = lastSelectedCellId.split('_').map(Number)
        return adjacentCells(i, j).some(([adjX, adjY]) => adjX === x && adjY === y);
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

const Board = () => {
    const field = useAppSelector(selectField)
    const fieldSize = useAppSelector(selectFieldSize)
    const wordPath = useAppSelector(selectWordPath)
    const computerWordPath = useAppSelector(selectComputerWordPath)
    const computerWordPathLength = useAppSelector(selectComputerWordPathLength)
    const lastSetLetterId = useAppSelector(selectLastSetLetterId)
    const status = useAppSelector(selectStatus)
    const hinting = useAppSelector(selectHinting)
    const dispatch = useAppDispatch()

    const onPlaceLetter = (event: ChangeEvent<HTMLInputElement>) => dispatch(placeLetter({
        letter: mapToAlphabet(event.target.value),
        cell: event.target.id
    }))

    const [index, setIndex] = useState(0)

    const onResetLetter = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        const target = event.target as HTMLDivElement
        dispatch(removeLetter({cell: target.id}))
    }

    useEffect(() => {
        if (index === computerWordPathLength) {
            if (hinting) {
                dispatch(resetHinting())
            }
            setIndex(0)
            dispatch(resetLastSetLetter())
            dispatch(setComputerWordPath([]))
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
                            highlightPrimary={lastSetLetterId === `${i}_${j}`}
                            highlightSecondary={wordPath.includes(`${i}_${j}`) || computerWordPath.slice(0, index + 1).includes(`${i}_${j}`)}
                            value={l}
                            editable={status !== 'PENDING' && computerWordPath.length === 0 && !lastSetLetterId && hasLetterInAdjacentCell(i, j, field)}
                            selectable={status !== 'PENDING' && computerWordPath.length === 0 && !!lastSetLetterId && (wordPath.length === 0 || isAdjacentToLastSelectedCell(i, j, wordPath))}
                            onSelectWord={(letter: string) => dispatch(updateWord({letter, cell: `${i}_${j}`}))}
                            onResetLetter={onResetLetter}
                            onChange={onPlaceLetter}
                        />))
                }
            </div>
        </div>
    )
}

export default Board
