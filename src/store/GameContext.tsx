// @ts-nocheck
import React from 'react'
import reducer from './reducer'
import store from './store'

const fieldX = [
    '.....',
    '.....',
    'БАЛДА',
    '.....',
    '.....'
]

const initialState = {
    field: fieldX.map(row => row.split('')),
    // field: [[]],
    lastSetLetter: { id: '', value: '' },
    word: [],
    wordsUsed: [],
    wordsByUser: [],
    wordsByComputer: []
}

export const GameContext = React.createContext()
export const GameContextProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    const gameStore = store(state, dispatch)

    return (
        <GameContext.Provider value={gameStore}>
            {children}
        </GameContext.Provider>
    )
}
