// @ts-nocheck
import React from 'react'
import './board.css'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchComputerMove, userMove, selectAll, resetWord } from '../store/reducer'
import store from '../store/store'
import Board from './Board'
import ScoreBoard from './ScoreBoard'


const Game = () => {
    const allState = useAppSelector(selectAll)
    const dispatch = useAppDispatch()

    const onSubmitWord = async () => {
        dispatch(userMove({ word: allState.word.join('') }))
        const { field, wordsUsed } = store.getState()
        dispatch(fetchComputerMove({ field, wordsUsed }))
    }

    return <>
        <h2>Chosen letter: {allState.lastSetLetter.value}</h2>
        <h2>Chosen word: {allState.word}</h2>
        <button onClick={() => dispatch(resetWord())}>Reset chosen word</button>
        <button onClick={onSubmitWord}>Submit chosen word</button>
        <br/>
        <Board/>
        <br/>
        <ScoreBoard/>
    </>
}

export default Game