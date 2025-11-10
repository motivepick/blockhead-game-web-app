import {FC, useCallback, MouseEvent} from 'react'
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
    onChange: (cell: Cell, letter: string) => void
    onSelectWord: (letter: string) => void
    onSubmitWord: () => void
    onResetLetter: (cell: Cell) => void
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

const cell = (id: string): Cell => {
    const terms = id.split('_')
    return [parseInt(terms[1]), parseInt(terms[2])] as Cell
}

const Cell: FC<Props> = (props) => {
    const {id, value, editable, selectable, onSelectWord, onSubmitWord, onResetLetter, onChange} = props
    const selectCell = useCallback(() => {
        selectable && onSelectWord(value)
    }, [selectable, onSelectWord, value])

    const selectCellAndSubmitWord = useCallback(() => {
        if (selectable) {
            onSelectWord(value)
        }
        onSubmitWord()
    }, [selectable, onSelectWord, value, onSubmitWord])

    if (value === '.') {
        return (
            <div className="cell" id={`div_${id}`}>
                <input
                    className={`${TEXT_COLOR} ${editable ? ACTIONABLE_BG_COLOR : NON_ACTIONABLE_BG_COLOR}`}
                    id={`input_${id}`}
                    type="text"
                    maxLength={1}
                    value={value === '.' ? '' : value}
                    onChange={event => onChange(cell(event.target.id), event.target.value)}
                    disabled={!editable}
                />
            </div>
        )
    }

    const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        const target = event.target as HTMLDivElement;
        onResetLetter(cell(target.id))
    }

    return (
        <div
            className={`cell user-select-none ${TEXT_COLOR} ${backgroundColor(props)} ${selectable ? 'selectable' : ''}`}
            id={id}
            onClick={selectCell}
            onDoubleClick={selectCellAndSubmitWord}
            onContextMenu={onContextMenu}
        >
            {value}
        </div>
    )
}

export default Cell
