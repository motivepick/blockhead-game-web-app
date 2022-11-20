import React from 'react'
import './board.css'

type TCell = {
    id: string,
    path: string[],
    letter: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSelectWord: (letter: string) => void
    onResetLetter: (e: React.MouseEvent<HTMLDivElement>) => void
}

const Cell = ({ id, path, letter, value, onSelectWord, onResetLetter, onChange }: TCell) => {
    const highlight = path.includes(id) ? "bg-indigo-200 dark:bg-indigo-600" : "bg-white dark:bg-slate-600"

    if (letter !== '.') {
        return <div className={`cell dark:text-gray-100 ${highlight}`} id={id} onClick={_ => onSelectWord(letter)}
                    onContextMenu={onResetLetter}>
            {letter}
        </div>
    }
    return <div className="cell" id={id}>
        <input className="cellInput dark:text-gray-100 dark:bg-slate-600" id={id} type="text" maxLength={1}
               value={value === '.' ? '' : value}
               onChange={onChange}/>
    </div>
}

export default Cell