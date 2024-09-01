// @ts-nocheck
import React, {useEffect} from 'react'
import {useAppDispatch, useAppSelector} from './store/hooks'
import {
    fetchComputerMove,
    fetchCreateNewField,
    fetchHint,
    resetWord,
    setDifficulty,
    setFieldSize,
    userMove
} from './store/reducer'
import {useSelector} from 'react-redux'
import {selectAll, selectDifficulty, selectFieldSize} from './store/selectors'
import Board from './board/Board'
import ScoreBoard from './board/ScoreBoard'
import Background from './components/Background'
import {TEXT_COLOR} from './const'

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
    }, [fieldSize])
    const allState = useAppSelector(selectAll)

    if (allState.field[0].length <= 0) return <div>Select field size</div>

    const onSubmitWord = async () => {
        if (allState.error) return
        dispatch(userMove())
        dispatch(fetchComputerMove())
    }

    const onResetWord = () => dispatch(resetWord())

    const onHint = () => dispatch(fetchHint())

    return (
        <Background>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                <div className="md:col-span-2 p-6">
                    <Board/>
                    <br/>
                    {allState.errors.map((error, i) =>
                        <p
                            key={`error${i}`}
                            className="h-10 px-6 font-semibold rounded-md text-red-900 dark:text-red-400"
                        >
                            Error: {error.message}
                        </p>
                    )}
                    <h2 className={`font-medium leading-tight text-3xl mt-0 mb-2 ${TEXT_COLOR}`}>Chosen letter: {allState.lastSetLetter.value}</h2>
                    <h2 className={`font-medium leading-tight text-3xl mt-0 mb-2 ${TEXT_COLOR}`}>Chosen word: {allState.word}</h2>
                    <br/>
                    <button
                        className="h-10 px-6 font-semibold rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-gray-200"
                        type="button"
                        onClick={onSubmitWord}
                    >
                        Submit chosen word
                    </button>
                    <button
                        className="h-10 px-6 font-semibold rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-gray-200"
                        type="button"
                        onClick={onResetWord}
                    >
                        Reset chosen word
                    </button>
                    <button
                        className="h-10 px-6 font-semibold rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-gray-200"
                        type="button"
                        onClick={onHint}
                    >
                        Hint
                    </button>
                </div>
                <div className="p-6">
                    <SelectDifficultyDropdown/>
                    <SelectFieldSizeDropdown/>
                    <ScoreBoard/>
                </div>
            </div>
        </Background>
    )
}

export default App
