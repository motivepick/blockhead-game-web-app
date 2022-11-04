// @ts-nocheck
import React, { useContext, useState } from 'react'
import './board.css'
import { makeMove } from '../api/service'
import Board from './Board'
import { GameContext } from '../store/GameContext'
import ScoreBoard from './ScoreBoard'

const Game = () => {
    const store = useContext(GameContext);
    console.log(store)

    const onSubmitWord = async () => {
        store.userMakesAMove(store.word.join(''))

        const computerMove = await makeMove({ field: store.field, usedWords: store.wordsUsed })
        store.computerMakesAMove(computerMove.word, computerMove.letter, computerMove.cell)
    }

    return <>
        <h2>Chosen letter: {store.lastSetLetter.value}</h2>
        <h2>Chosen word: {store.word}</h2>
        <button onClick={store.resetWord}>Reset chosen word</button>
        <button onClick={onSubmitWord}>Submit chosen word</button>
        <br/>
        <Board />
        <br/>
        <ScoreBoard />
    </>
}

export default Game