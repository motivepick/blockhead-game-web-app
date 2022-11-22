// @ts-nocheck
import React from 'react'
import Game from './board/Game'
import { useAppDispatch } from './store/hooks'
import { fetchCreateNewField, setDifficulty } from './store/reducer'

const SelectDifficultyDropdown = () => {
    const dispatch = useAppDispatch()
    const data = ['Easy', 'Medium', 'Hard']
    const onSelect = ({ target }) => {
        const difficulty = target.value
        dispatch(setDifficulty({ difficulty }))
    }
    return <Dropdown data={data} onSelect={onSelect} />
}

const SelectFieldSizeDropdown = () => {
    const dispatch = useAppDispatch()
    const data = [3,5,7]
    const onSelect = ({ target }) => {
        dispatch(fetchCreateNewField(Number(target.value)))
    }
    return <Dropdown data={data} onSelect={onSelect} />
}

const Dropdown = ({ data, onSelect }) => {
    const options = data.map((item, index) => (
        <option key={index} value={item}>
            {item}
        </option>
    ))

    return  <div className="relative w-full lg:max-w-sm">
        <select className="w-full p-2.5 bg-white dark:bg-slate-700 text-gray-500 dark:text-white border dark:border-slate-600 rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                onChange={onSelect}
        >
            <option>--Select--</option>
            {options}
        </select>
    </div>
}

const App = () =>
    <div className="dark h-full min-h-full">
        <div className="h-full min-h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <SelectDifficultyDropdown/>
            <SelectFieldSizeDropdown/>
            <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-center">Blockhead</h1>
            <br/>
            <Game/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    </div>

export default App
