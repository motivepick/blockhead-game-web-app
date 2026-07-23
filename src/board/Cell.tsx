import type { FC, MouseEvent } from 'react'
import { useCallback } from 'react'
import './Board.css'

type Props = {
    id: string
    highlightPrimary: boolean
    highlightSecondary: boolean
    value: string
    editable: boolean
    selectable: boolean
    onChange: (cell: Cell, letter: string) => void
    onSelectWord: (letter: string) => void
    onSubmitWord: () => void
    onResetLetter: (cell: Cell) => void
}

const backgroundColor = (props: Props) => {
    const { highlightPrimary, highlightSecondary, selectable } = props
    if (highlightPrimary && highlightSecondary) {
        return 'board-cell--highlight-mixed'
    } else if (highlightPrimary) {
        return 'board-cell--highlight-primary'
    } else if (highlightSecondary) {
        return 'board-cell--highlight-secondary'
    }
    return selectable ? 'board-cell--actionable' : 'board-cell--muted'
}

const cell = (id: string): Cell => {
    const terms = id.split('_')
    return [parseInt(terms.at(-2) ?? ''), parseInt(terms.at(-1) ?? '')]
}

const Cell: FC<Props> = props => {
    const { id, value, editable, selectable, onSelectWord, onSubmitWord, onResetLetter, onChange } = props
    const selectCell = useCallback(() => {
        if (selectable) {
            onSelectWord(value)
        }
    }, [selectable, onSelectWord, value])

    const selectCellAndSubmitWord = useCallback(() => {
        if (selectable) {
            onSelectWord(value)
        }
        onSubmitWord()
    }, [selectable, onSelectWord, value, onSubmitWord])

    if (value === '.') {
        return (
            <div className="board-cell-slot" id={`div_${id}`}>
                <input
                    className={`board-cell board-cell-input ${editable ? 'board-cell--actionable' : 'board-cell--muted'}`}
                    id={`input_${id}`}
                    type="text"
                    maxLength={1}
                    value=""
                    autoComplete="off"
                    onChange={event => {
                        onChange(cell(event.target.id), event.target.value)
                    }}
                    disabled={!editable}
                />
            </div>
        )
    }

    const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        const target = event.target as HTMLDivElement
        onResetLetter(cell(target.id))
    }

    return (
        <div
            className={`board-cell user-select-none ${backgroundColor(props)} ${selectable ? 'board-cell--selectable' : ''}`}
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
