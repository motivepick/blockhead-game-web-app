import React from 'react'
import './board.css'

type TCell = {
    id: string,
    letter: string,
    value: string,
    onChange: (smth: any) => void
    onSelectWord: (smth: string) => void
}

const Cell = ({ id, letter, value, onSelectWord, onChange }: TCell) => {
    if (letter !== '.') return <td onClick={event => onSelectWord(letter)}>{letter}</td>
    return <td><input id={id} type="text" maxLength={1} value={value === '.' ? '' : value} onChange={onChange}/></td>
}

export default Cell