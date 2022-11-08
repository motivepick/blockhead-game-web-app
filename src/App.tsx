import React from 'react'
import Game from './board/Game'
import {useAppDispatch} from './store/hooks'
import {fetchCreateNewField} from './store/reducer'

const App = () => {
    const dispatch = useAppDispatch()
    dispatch(fetchCreateNewField(5))

    return <>
        <h1 className="font-medium leading-tight text-5xl mt-0 mb-2">Blockhead</h1>
        <br/>
        <Game/>
    </>
}

export default App
