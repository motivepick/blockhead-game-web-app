// @ts-nocheck
import React, { useEffect } from 'react'
import { createNewField } from '../api/service'
import reducer from './reducer'
import store from './store'

const initialState = {
    field: [[]],
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

    useEffect(() => {
        async function createInitialField() {
            const newField = await createNewField()
            gameStore.createNewField(newField)
        }

        createInitialField()
    }, [])

    return (
        <GameContext.Provider value={gameStore}>
            {children}
        </GameContext.Provider>
    )
}
