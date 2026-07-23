import type { ChangeEvent } from 'react'
import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
    fetchComputerMove,
    fetchCreateNewField,
    fetchHint,
    resetUncommittedUserWord,
    rollbackUncommittedCell,
    selectDifficulty,
    selectErrors,
    selectField,
    selectFieldSize,
    selectHinting,
    selectStatus,
    selectUncommittedCell,
    selectUncommittedUserWord,
    setDifficulty,
    setFieldSize,
    submitUserMove
} from './store/reducer'
import Board from './board/Board'
import ScoreBoard from './board/ScoreBoard'
import Background from './components/Background'
import { ACTIVE_HINT_BUTTON, ACTIVE_PRIMARY_BUTTON, ACTIVE_SECONDARY_BUTTON, DISABLED_BUTTON } from './const'
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
    return <Dropdown id="difficulty" label={t('difficultyLabel')} value={difficulty} data={data} onSelect={onSelect} />
}

const SelectFieldSizeDropdown = () => {
    const { t } = useTranslation()
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
    return <Dropdown id="field-size" label={t('fieldSizeLabel')} value={fieldSize} data={data} onSelect={onSelect} />
}

type DropdownProps = {
    id: string
    label: string
    value: number | string
    data: { code: number | string; label: string }[]
    onSelect: (e: ChangeEvent<HTMLSelectElement>) => void
}

const Dropdown = ({ id, label, value, data, onSelect }: DropdownProps) => {
    const options = data.map((item, index) => (
        <option key={index} value={item.code}>
            {item.label}
        </option>
    ))

    return (
        <label className="block" htmlFor={id}>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
            <select
                id={id}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                onChange={onSelect}
                value={value}
            >
                {options}
            </select>
        </label>
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
    const status = useAppSelector(selectStatus)

    const onResetWord = useCallback(() => {
        if (uncommittedUserWord.length) {
            dispatch(resetUncommittedUserWord())
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
                    const element = document.getElementById(
                        `input_${String(i)}_${String(j)}`
                    ) as HTMLInputElement | null
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

    const computerIsThinking = status === 'PENDING'
    const canSubmit = !hinting && !computerIsThinking && uncommittedUserWord.length > 0 && errors.length === 0
    const canReset =
        !hinting && !computerIsThinking && (uncommittedUserWord.length > 0 || !equals(uncommittedCell, [-1, -1]))
    const canHint = !hinting && !computerIsThinking

    if (!field[0]?.length) {
        return (
            <Background>
                <main className="flex min-h-screen items-center justify-center px-4">
                    <p className="animate-pulse text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {t('loadingBoard')}
                    </p>
                </main>
            </Background>
        )
    }

    const handleSubmitWord = () => {
        if (!canSubmit) return
        void dispatch(submitUserMove())
            .unwrap()
            .then(() => dispatch(fetchComputerMove()))
    }

    const onHint = () => {
        if (!canHint) return
        dispatch(resetUncommittedUserWord())
        dispatch(rollbackUncommittedCell())
        void dispatch(fetchHint())
    }

    const statusLabel = hinting ? t('hintingStatus') : computerIsThinking ? t('computerThinking') : t('yourTurn')

    return (
        <Background>
            <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4 sm:items-center">
                        <div
                            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-3xl font-black text-white shadow-lg shadow-indigo-600/20 sm:size-16"
                            aria-hidden="true"
                        >
                            Б
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-400">
                                {t('appKicker')}
                            </p>
                            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                                {t('appTitle')}
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                                {t('appSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                        aria-live="polite"
                    >
                        <span
                            className={`size-2 rounded-full ${computerIsThinking ? 'animate-pulse bg-amber-400' : 'bg-emerald-500'}`}
                        />
                        {statusLabel}
                    </div>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,44rem)_22rem] lg:justify-center">
                    <section
                        className="rounded-3xl border border-white/70 bg-white/80 p-3 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-5 dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                        aria-label={t('boardTitle')}
                    >
                        <Board onSubmitWord={handleSubmitWord} />

                        <div className="mt-3 min-h-7 px-1 sm:mt-5" aria-live="polite">
                            {errors.map((error, i) => (
                                <p
                                    key={`error${String(i)}`}
                                    className="text-sm font-semibold text-rose-600 dark:text-rose-400"
                                >
                                    {t(error.messageKey)}
                                </p>
                            ))}
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                            <button
                                className={canSubmit ? ACTIVE_PRIMARY_BUTTON : DISABLED_BUTTON}
                                type="button"
                                onClick={handleSubmitWord}
                                disabled={!canSubmit}
                            >
                                {t('submitWord')}
                            </button>
                            <button
                                className={canReset ? ACTIVE_SECONDARY_BUTTON : DISABLED_BUTTON}
                                type="button"
                                onClick={onResetWord}
                                disabled={!canReset}
                            >
                                {t(uncommittedUserWord.length ? 'resetChosenWord' : 'resetLetter')}
                            </button>
                            <button
                                className={canHint ? ACTIVE_HINT_BUTTON : DISABLED_BUTTON}
                                type="button"
                                onClick={onHint}
                                disabled={!canHint}
                            >
                                {t('hint')}
                            </button>
                        </div>

                        <p className="mt-4 px-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {t('keyboardHelp')}
                        </p>
                    </section>

                    <aside className="space-y-6">
                        <section
                            className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                            aria-labelledby="settings-title"
                        >
                            <h2 id="settings-title" className="text-lg font-bold text-slate-900 dark:text-white">
                                {t('settingsTitle')}
                            </h2>
                            <div className="mt-4 space-y-4">
                                <SelectDifficultyDropdown />
                                <SelectFieldSizeDropdown />
                            </div>
                        </section>

                        <ScoreBoard />

                        <section
                            className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-black/20"
                            aria-labelledby="how-to-play-title"
                        >
                            <h2 id="how-to-play-title" className="text-lg font-bold text-slate-900 dark:text-white">
                                {t('howToPlayTitle')}
                            </h2>
                            <ol className="mt-4 space-y-3">
                                {[t('howToPlayStep1'), t('howToPlayStep2'), t('howToPlayStep3')].map((step, index) => (
                                    <li
                                        key={step}
                                        className="flex gap-3 text-sm leading-5 text-slate-600 dark:text-slate-300"
                                    >
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                            {index + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </aside>
                </div>
            </main>
        </Background>
    )
}
