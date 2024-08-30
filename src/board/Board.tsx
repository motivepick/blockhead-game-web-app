import React, {ChangeEvent, MouseEvent, useEffect} from 'react'
import './board.css'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {placeLetter, removeLetter, updateWord} from '../store/reducer'
import Cell from './Cell'
import {selectAll, selectField, selectLastSetLetterValue, selectWordPath} from "../store/selectors"

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
    const allState = useAppSelector(selectAll)
    const field = useAppSelector(selectField)
    const wordPath = useAppSelector(selectWordPath)
    const lastSetLetterValue = useAppSelector(selectLastSetLetterValue)
    const dispatch = useAppDispatch()

    const onPlaceLetter = (event: ChangeEvent<HTMLInputElement>) => dispatch(placeLetter({
        letter: event.target.value,
        cell: event.target.id
    }))

    const onResetLetter = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        const target = event.target as HTMLDivElement
        dispatch(removeLetter({cell: target.id}))
    }

    useEffect(() => {
        console.log('Computer word path:', wordPath)

    }, [wordPath]);

    return (
        <div className="container dark:bg-gray-400">
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${allState.fieldSize}, 80px)`,
                    gridTemplateRows: `repeat(${allState.fieldSize}, 80px)`
                }}
            >
                {
                    field.flatMap((row, i) => row.map((l, j) =>
                        <Cell
                            key={`${i}_${j}`}
                            id={`${i}_${j}`}
                            highlight={wordPath.includes(`${i}_${j}`)}
                            letter={l}
                            value={l}
                            editable={!lastSetLetterValue && hasLetterInAdjacentCell(i, j, field)}
                            selectable={!!lastSetLetterValue && (wordPath.length === 0 || isAdjacentToLastSelectedCell(i, j, wordPath))}
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
