import React, {FC, useCallback} from 'react'
import './Board.css'
import {
    ACTIONABLE_BG_COLOR,
    HIGHLIGHTED_SECONDARY_BG_COLOR,
    HIGHLIGHTED_PRIMARY_BG_COLOR,
    NON_ACTIONABLE_BG_COLOR,
    TEXT_COLOR, HIGHLIGHTED_MIXED_BG_COLOR
} from "../const";

type Props = {
    id: string,
    highlightPrimary: boolean,
    highlightSecondary: boolean,
    value: string,
    editable: boolean,
    selectable: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSelectWord: (letter: string) => void
    onResetLetter: (e: React.MouseEvent<HTMLDivElement>) => void
}

const backgroundColor = (props: Props) => {
    const {highlightPrimary, highlightSecondary, selectable} = props
    if (highlightPrimary && highlightSecondary) {
        return HIGHLIGHTED_MIXED_BG_COLOR
    } else if (highlightPrimary) {
        return HIGHLIGHTED_PRIMARY_BG_COLOR
    } else if (highlightSecondary) {
        return HIGHLIGHTED_SECONDARY_BG_COLOR
    }
    return selectable ? ACTIONABLE_BG_COLOR : NON_ACTIONABLE_BG_COLOR;
}

const Cell: FC<Props> = (props) => {
    const {id, value, editable, selectable, onSelectWord, onResetLetter, onChange} = props
    const selectCell = useCallback(() => {
        selectable && onSelectWord(value)
    }, [selectable, onSelectWord, value])

    if (value === '.') {
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

    return (
        <div
            className={`cell ${TEXT_COLOR} ${backgroundColor(props)} ${selectable ? 'selectable' : ''}`}
            id={id}
            onClick={selectCell}
            onContextMenu={onResetLetter}>
            {value}
        </div>
    )
}

export default Cell
