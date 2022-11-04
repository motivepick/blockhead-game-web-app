// @ts-nocheck
import React, { useContext, useState } from 'react'
import './board.css'
import { GameContext } from '../store/GameContext'
import Cell from './Cell'

const Board = () => {
    const store = useContext(GameContext);

    const onPlaceLetter = event => {
        store.placeLetter(event.target.value, event.target.id)
    }

    return <table>
        <tbody>
        {
            store.field
                .map((row, i) => row.map((l, j) =>
                    <Cell key={`${i}${j}`} id={`${i}${j}`} letter={l} value={l} onSelectWord={store.updateWord} onChange={onPlaceLetter}/>))
                .map((row, i) => <tr key={i}>{row}</tr>)
        }
        </tbody>
    </table>
}

export default Board