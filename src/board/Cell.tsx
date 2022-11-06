import React, { useState } from 'react'
import './board.css'

type TCell = {
    id: string,
    letter: string,
    value: string,
    onChange: (smth: any) => void
    onSelectWord: (smth: string) => void
}

const Cell = ({ id, letter, value, onSelectWord, onChange }: TCell) => {
    const [colored, setColored] = useState(false);

    if (letter !== '.') return <td className={colored ? "cell selectedCell" : "cell"} onClick={event => {
        setColored(true)
        onSelectWord(letter)
    }}>{letter}</td>
    return <td className="cell2"><input className="cellInput" id={id} type="text" maxLength={1} value={value === '.' ? '' : value} onChange={onChange}/></td>
}

export default Cell