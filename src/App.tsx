// @ts-nocheck
import React, {useCallback, useEffect} from 'react'
import {useAppDispatch} from './store/hooks'
import {
    fetchComputerMove,
    fetchCreateNewField,
    fetchHint,
    removeLetter,
    resetWord,
    setDifficulty,
    setFieldSize,
    userMove
} from './store/reducer'
import {useSelector} from 'react-redux'
import {
    selectDifficulty,
    selectErrors,
    selectField,
    selectFieldSize,
    selectHinting,
    selectLastSetLetterId,
    selectWordPath
} from './store/selectors'
import Board from './board/Board'
import ScoreBoard from './board/ScoreBoard'
import Background from './components/Background'
import {ACTIVE_PRIMARY_BUTTON, ACTIVE_SECONDARY_BUTTON, DISABLED_BUTTON} from "./const";

const SelectDifficultyDropdown = () => {
    const dispatch = useAppDispatch()
    const difficulty = useSelector(selectDifficulty)
    const data = ['Easy', 'Medium', 'Hard']
    const onSelect = ({target}) => {
        const difficulty = target.value
        dispatch(setDifficulty({difficulty}))
    }
    return <Dropdown defaultValue={difficulty} data={data} onSelect={onSelect}/>
}

const SelectFieldSizeDropdown = () => {
    const dispatch = useAppDispatch()
    const fieldSize = useSelector(selectFieldSize)
    const data = [3, 5, 7]
    const onSelect = ({target}) => {
        const fieldSize = Number(target.value)
        dispatch(setFieldSize({fieldSize}))
    }
    return <Dropdown defaultValue={fieldSize} data={data} onSelect={onSelect}/>
}

const Dropdown = ({defaultValue, data, onSelect}) => {
    const options = data.map((item, index) => (
        <option key={index} value={item}>
            {item}
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

const App = () => {
    const dispatch = useAppDispatch()
    const fieldSize = useSelector(selectFieldSize)
    useEffect(() => {
        dispatch(fetchCreateNewField(fieldSize))
    }, [dispatch, fieldSize])

    const field = useSelector(selectField)
    const errors = useSelector(selectErrors)
    const wordPath = useSelector(selectWordPath)
    const lastSetLetterId = useSelector(selectLastSetLetterId)
    const hinting = useSelector(selectHinting)

    const onResetWord = useCallback(() => {
        if (wordPath.length) {
            dispatch(resetWord());
        } else if (lastSetLetterId) {
            dispatch(removeLetter({cell: lastSetLetterId}))
        }
    }, [wordPath, dispatch, resetWord])

    const canReset = !hinting && (wordPath.length || lastSetLetterId)

    if (field[0].length <= 0) return <div>Select field size</div>

    const onSubmitWord = async () => {
        if (errors.length) return
        dispatch(userMove())
        dispatch(fetchComputerMove())
    }

    const onHint = () => dispatch(fetchHint())

    return (
        <Background>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
                <div className="md:col-span-2">
                    <Board/>
                    <br/>
                    {errors.map((error, i) =>
                        <p
                            key={`error${i}`}
                            className="h-10 px-6 font-semibold rounded-md text-red-900 dark:text-red-400"
                        >
                            Error: {error.message}
                        </p>
                    )}
                    <br/>
                    <button
                        className={hinting ? DISABLED_BUTTON : ACTIVE_PRIMARY_BUTTON}
                        type="button"
                        onClick={onSubmitWord}
                        disabled={hinting}
                    >
                        Submit chosen word
                    </button>
                    <button
                        className={canReset ? ACTIVE_SECONDARY_BUTTON : DISABLED_BUTTON}
                        type="button"
                        onClick={onResetWord}
                        disabled={!canReset}
                    >
                        {wordPath.length ? 'Reset chosen word' : 'Reset letter'}
                    </button>
                    <button
                        className={hinting ? DISABLED_BUTTON : ACTIVE_SECONDARY_BUTTON}
                        type="button"
                        onClick={onHint}
                        disabled={hinting}
                    >
                        Hint
                    </button>
                </div>
                <div className="md:col-span-1">
                    <SelectDifficultyDropdown/>
                    <SelectFieldSizeDropdown/>
                    <ScoreBoard/>
                </div>
            </div>
        </Background>
    )
}

export default App
