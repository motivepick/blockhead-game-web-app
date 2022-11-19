import React from 'react'
import Game from './board/Game'
import { useAppDispatch } from './store/hooks'
import { fetchCreateNewField } from './store/reducer'

const App = () => {
    const dispatch = useAppDispatch()
    dispatch(fetchCreateNewField(5))

    return <body className="dark h-full min-h-full">
    <div className="h-full min-h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
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
    </body>
}

export default App
