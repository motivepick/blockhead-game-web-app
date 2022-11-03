import React from 'react'
import './board.css'
import Cell from "./Cell"

type TBoard = {
    data: Field
}

const Board = ({ data }: TBoard) => {
    return <>
        <h1>Board:</h1>
        <table>
            {
                data
                    .map(row => row.map(Cell))
                    .map(row => <tr>{row}</tr>)
            }
        </table>
    </>
}

export default Board