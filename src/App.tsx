// @ts-nocheck
import React, {useEffect} from 'react'
import Game from './board/Game'
import {useAppDispatch} from './store/hooks'
import {fetchCreateNewField, setDifficulty, setFieldSize} from './store/reducer'
import {useSelector} from "react-redux";
import {selectDifficulty, selectFieldSize} from "./store/selectors";

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
                className="w-full p-2.5 bg-white dark:bg-slate-700 text-gray-500 dark:text-white border dark:border-slate-600 rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
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

    return <div className="dark h-full min-h-full min-h-screen">
        <div className="h-full min-h-full min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <SelectDifficultyDropdown/>
            <SelectFieldSizeDropdown/>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-center">Blockhead</h1>
            <br/>
            <Game/>
        </div>
    </div>
}

export default App
