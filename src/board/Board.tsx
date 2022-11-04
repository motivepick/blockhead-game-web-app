// @ts-nocheck
import React, { useState } from 'react'
import './board.css'
import Cell from './Cell'

type TBoard = {
    data: Field
}

const Board = ({ data, onSelectWord, onPlaceLetter }) =>
    <table>
        <tbody>
        {
            data
                .map((row, i) => row.map((l, j) =>
                    <Cell key={`${i}${j}`} id={`${i}${j}`} letter={l} value={l} onSelectWord={onSelectWord}
                          onChange={onPlaceLetter}/>))
                .map((row, i) => <tr key={i}>{row}</tr>)
        }
        </tbody>
    </table>

export default Board