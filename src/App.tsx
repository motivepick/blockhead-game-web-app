import React from 'react'
import Game from './board/Game'
import { GameContextProvider } from './store/GameContext'

const App = () =>
    <>
        <h1>Hello</h1>
        <GameContextProvider>
            <Game/>
        </GameContextProvider>
    </>

export default App
