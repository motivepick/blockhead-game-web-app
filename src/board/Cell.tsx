import React from 'react'
import './board.css'

type TCell = {
    id: string,
    letter: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSelectWord: (letter: string) => void
}

const Cell = ({ id, letter, value, onSelectWord, onChange }: TCell) => {
    if (letter !== '.') return <div className="cell" id={id} onClick={_ => onSelectWord(letter)}>
        {letter}
    </div>
    return <div className="cell" id={id}>
        <input className="cellInput" id={id} type="text" maxLength={1} value={value === '.' ? '' : value}
               onChange={onChange}/>
    </div>
}

export default Cell