// @ts-nocheck
import React, { useState } from 'react'
import './board.css'
import Cell from "./Cell"

type TBoard = {
    data: Field
}

const Board = ({ data }: TBoard) => {
    const [field, setField] = useState(data)
    const [lastSetLetter, setLastSetLetter] = useState({ id: "", value: "" })

    const updateState = event => {
        const [x, y] = event.target.id
        const letter = event.target.value.toUpperCase()

        const updatedField = [...field]
        updatedField[x][y] = letter
        if (lastSetLetter.id !== "") {
            const [xi, yi] = lastSetLetter.id
            updatedField[xi][yi] = "."
        }

        setField(updatedField)
        setLastSetLetter({ id: event.target.id, value: letter })
    }

    return <>
        <h1>Board:</h1>
        <h2>Chosen letter: {lastSetLetter.value}</h2>
        <h2>Chosen word:</h2>
        <table>
            <tbody>
            {
                data
                    .map((row, i) => row.map((l, j) =>
                        <Cell key={`${i}${j}`} id={`${i}${j}`} letter={l} value={l} onChange={updateState}/>))
                    .map((row, i) => <tr key={i}>{row}</tr>)
            }
            </tbody>
        </table>
    </>
}

export default Board