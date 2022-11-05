import React from 'react'
import Game from './board/Game'
import {useAppDispatch} from './store/hooks'
import {fetchCreateNewField} from './store/reducer'

const App = () => {
    const dispatch = useAppDispatch()
    dispatch(fetchCreateNewField(5))

    return <>
        <h1>Blockhead</h1>
        <Game/>
    </>
}

export default App
