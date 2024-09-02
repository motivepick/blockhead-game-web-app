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
        letter: event.target.value,
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
            }, 300);
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
