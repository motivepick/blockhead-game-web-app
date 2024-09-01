import React, {useCallback} from 'react'
import './board.css'
import {ACTIONABLE_BG_COLOR, HIGHLIGHTED_BG_COLOR, NON_ACTIONABLE_BG_COLOR, TEXT_COLOR} from "../const";

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
                    className={`${TEXT_COLOR} ${editable ? ACTIONABLE_BG_COLOR : NON_ACTIONABLE_BG_COLOR}`}
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

    const background = selectable ? ACTIONABLE_BG_COLOR : NON_ACTIONABLE_BG_COLOR
    return (
        <div
            className={`cell ${TEXT_COLOR} ${highlight ? HIGHLIGHTED_BG_COLOR : background} ${selectable ? 'selectable' : ''}`}
            id={id}
            onClick={selectCell}
            onContextMenu={onResetLetter}>
            {letter}
        </div>
    )
}

export default Cell