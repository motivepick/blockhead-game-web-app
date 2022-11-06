import React from 'react'
import './board.css'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { placeLetter, selectAll, updateWord } from '../store/reducer'
import Cell from './Cell'

const Board = () => {
    const allState = useAppSelector(selectAll)
    const dispatch = useAppDispatch()

    const onPlaceLetter = (event: React.ChangeEvent<HTMLInputElement>) => dispatch(placeLetter({
        letter: event.target.value,
        cell: event.target.id
    }))

    return <table>
        <tbody className="row" >
        {
            allState.field
                .map((row, i) => row.map((l, j) =>
                    <Cell key={`${i}${j}`} id={`${i}${j}`} letter={l} value={l}
                          onSelectWord={(letter: string) => dispatch(updateWord({ letter }))}
                          onChange={onPlaceLetter}/>))
                .map((row, i) => <tr key={i}>{row}</tr>)
        }
        </tbody>
    </table>
}

export default Board