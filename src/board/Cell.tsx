import React from 'react'
import './board.css'

type TCell = {
    id: string,
    letter: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSelectWord: (letter: string) => void
    onResetLetter: (e: React.MouseEvent<HTMLDivElement>) => void
}

const Cell = ({ id, letter, value, onSelectWord, onResetLetter, onChange }: TCell) => {
    if (letter !== '.') {
        return <div className="cell" id={id} onClick={_ => onSelectWord(letter)} onContextMenu={onResetLetter}>
            {letter}
        </div>
    }
    return <div className="cell" id={id}>
        <input className="cellInput" id={id} type="text" maxLength={1} value={value === '.' ? '' : value}
               onChange={onChange}/>
    </div>
}

export default Cell