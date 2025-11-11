import type { ChangeEvent } from 'react'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
    fetchComputerMove,
    fetchCreateNewField,
    fetchHint,
    resetWord,
    rollbackUncommittedCell,
    selectDifficulty,
    selectErrors,
    selectField,
    selectFieldSize,
    selectHinting,
    selectUncommittedCell,
    selectUncommittedUserWord,
    setDifficulty,
    setFieldSize,
    submitUserMove
} from './store/reducer'
import Board from './board/Board'
import ScoreBoard from './board/ScoreBoard'
import Background from './components/Background'
import { ACTIVE_PRIMARY_BUTTON, ACTIVE_SECONDARY_BUTTON, DISABLED_BUTTON } from './const'
import { useTranslation } from 'react-i18next'
import { equals } from './common'

const SelectDifficultyDropdown = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const difficulty = useAppSelector(selectDifficulty)
    const data = [
        { code: 'EASY', label: t('difficultyEasy') },
        { code: 'MEDIUM', label: t('difficultyMedium') },
        { code: 'HARD', label: t('difficultyHard') }
    ]
    const onSelect = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const difficulty = target.value
        void dispatch(setDifficulty(difficulty))
    }
    return <Dropdown defaultValue={difficulty} data={data} onSelect={onSelect} />
}

const SelectFieldSizeDropdown = () => {
    const dispatch = useAppDispatch()
    const fieldSize = useAppSelector(selectFieldSize)
    const data = [
        { code: 3, label: '3 x 3' },
        { code: 5, label: '5 x 5' },
        { code: 7, label: '7 x 7' }
    ]
    const onSelect = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const fieldSize = Number(target.value)
        void dispatch(setFieldSize(fieldSize))
    }
    return <Dropdown defaultValue={fieldSize} data={data} onSelect={onSelect} />
}

type DropdownProps<T> = {
    defaultValue: T
    data: { code: T | number; label: string }[]
    onSelect: (e: ChangeEvent<HTMLSelectElement>) => void
}

const Dropdown = ({ defaultValue, data, onSelect }: DropdownProps<number | string>) => {
    const options = data.map((item, index) => (
        <option key={index} value={item.code}>
            {item.label}
        </option>
    ))

    return (
        <div className="relative w-full lg:max-w-sm">
            <select
                className="w-full p-2.5 dark:bg-slate-700 text-gray-500 dark:text-white border dark:border-slate-600 rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                onChange={onSelect}
                defaultValue={defaultValue}
            >
                {options}
            </select>
        </div>
    )
}

export const App = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const fieldSize = useAppSelector(selectFieldSize)

    useEffect(() => {
        void dispatch(fetchCreateNewField(fieldSize))
    }, [dispatch, fieldSize])

    const field = useAppSelector(selectField)
    const errors = useAppSelector(selectErrors)
    const uncommittedUserWord = useAppSelector(selectUncommittedUserWord)
    const uncommittedCell = useAppSelector(selectUncommittedCell)
    const hinting = useAppSelector(selectHinting)

    const onResetWord = useCallback(() => {
        if (uncommittedUserWord.length) {
            dispatch(resetWord())
        } else if (!equals(uncommittedCell, [-1, -1])) {
            dispatch(rollbackUncommittedCell())
            setTimeout(() => {
                const [x, y] = uncommittedCell
                const element = document.getElementById(`input_${String(x)}_${String(y)}`) as HTMLInputElement | null
                if (element) element.focus()
            }, 0)
        } else {
            field.forEach((row, i) => {
                row.forEach((_, j) => {
                    const element = document.getElementById(`input_${String(i)}_${String(j)}`) as HTMLInputElement | null
                    if (element) element.blur()
                })
            })
        }
    }, [uncommittedUserWord.length, uncommittedCell, dispatch, field])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' || event.key === 'Escape') {
                if (!hinting) {
                    onResetWord()
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [hinting, uncommittedUserWord, uncommittedCell, onResetWord])

    const canReset = !hinting && (uncommittedUserWord.length || !equals(uncommittedCell, [-1, -1]))

    if (field[0].length <= 0) return <div>Select field size</div>

    const handleSubmitWord = () => {
        if (uncommittedUserWord.length === 0 || errors.length > 0) return
        void dispatch(submitUserMove())
            .unwrap()
            .then(() => dispatch(fetchComputerMove()))
    }

    const onHint = () => {
        dispatch(resetWord())
        dispatch(rollbackUncommittedCell())
        void dispatch(fetchHint())
    }

    return (
        <Background>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                <div className="md:col-span-2">
                    <Board onSubmitWord={handleSubmitWord} />
                    <br />
                    {errors.map((error, i) => (
                        <p key={`error${String(i)}`} className="h-10 px-6 font-semibold rounded-md text-red-900 dark:text-red-400">
                            {t(error.messageKey)}
                        </p>
                    ))}
                    <br />
                    <button
                        className={hinting || uncommittedUserWord.length === 0 || errors.length > 0 ? DISABLED_BUTTON : ACTIVE_PRIMARY_BUTTON}
                        type="button"
                        onClick={handleSubmitWord}
                        disabled={hinting}
                    >
                        {t('submitWord')}
                    </button>
                    <button className={canReset ? ACTIVE_SECONDARY_BUTTON : DISABLED_BUTTON} type="button" onClick={onResetWord} disabled={!canReset}>
                        {t(uncommittedUserWord.length ? 'resetChosenWord' : 'resetLetter')}
                    </button>
                    <button className={hinting ? DISABLED_BUTTON : ACTIVE_SECONDARY_BUTTON} type="button" onClick={onHint} disabled={hinting}>
                        {t('hint')}
                    </button>
                </div>
                <div className="md:col-span-1">
                    <SelectDifficultyDropdown />
                    <SelectFieldSizeDropdown />
                    <ScoreBoard />
                </div>
            </div>
        </Background>
    )
}
