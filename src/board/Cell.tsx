import React, {useCallback} from 'react'
import './board.css'

type TCell = {
    id: string,
    highlight: boolean,
    letter: string,
    value: string,
    editable: boolean,
    selectable: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSelectWord: (letter: string) => void
    onResetLetter: (e: React.MouseEvent<HTMLDivElement>) => void
}

const Cell = ({id, highlight, letter, value, editable, selectable, onSelectWord, onResetLetter, onChange}: TCell) => {
    const selectCell = useCallback(() => {
        selectable && onSelectWord(letter)
    }, [selectable, letter])

    if (letter === '.') {
        return (
            <div className="cell" id={id}>
                <input
                    className={`cellInput dark:text-gray-100 ${editable ? "dark:bg-gray-500" : "dark:bg-slate-600"}`}
                    id={id}
                    type="text"
                    maxLength={1}
                    value={value === '.' ? '' : value}
                    onChange={onChange}
                    disabled={!editable}
                />
            </div>
        )
    }

    const background = selectable ? "bg-white dark:bg-gray-500" : "bg-white dark:bg-slate-600"
    return (
        <div
            className={`cell dark:text-gray-100 ${highlight ? 'bg-indigo-200 dark:bg-indigo-600' : background} ${selectable ? 'selectable' : ''}`}
            id={id}
            onClick={selectCell}
            onContextMenu={onResetLetter}>
            {letter}
        </div>
    )
}

export default Cell