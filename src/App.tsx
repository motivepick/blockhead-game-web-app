import React from 'react'
import Game from './board/Game'
import { useAppDispatch } from './store/hooks'
import { fetchCreateNewField, userMove } from './store/reducer'

const App = () => {
    const dispatch = useAppDispatch()
    dispatch(fetchCreateNewField())

    return <>
        <h1>Hello</h1>
        <Game/>
    </>
}


export default App
