// @ts-nocheck
import React, { useState } from 'react'
import './board.css'
import { makeMove } from '../api/service'
import Board from './Board'
import ScoreBoard from './ScoreBoard'

type TGame = {
    data: Field
}

const Game = ({ data }: TGame) => {
    const [field, setField] = useState(data)
    const [lastSetLetter, setLastSetLetter] = useState({ id: '', value: '' })
    const [word, setWord] = useState([])
    const [usedWords, setUsedWords] = useState([data[2]?.join('')])

    const [userWords, setUserWords] = useState([])
    const [computerWords, setComputerWords] = useState([])

    const updateState = event => {
        const [x, y] = event.target.id
        const letter = event.target.value.toUpperCase()

        const updatedField = [...field]
        updatedField[x][y] = letter
        if (lastSetLetter.id !== '') {
            const [xi, yi] = lastSetLetter.id
            updatedField[xi][yi] = '.'
        }

        setField(updatedField)
        setLastSetLetter({ id: event.target.id, value: letter })
    }

    const onSelectWord = (letter: string) => {
        setWord([...word, letter])
    }

    const onResetWord = () => {
        setWord([])
    }

    const onSubmitWord = async () => {
        setUsedWords([...usedWords, word.join('')])
        setUserWords([...userWords, word.join('')])
        setWord([])

        const computerMove = await makeMove({ field, usedWords })
        const [x, y] = computerMove.cell
        const updatedField = [...field]
        updatedField[x][y] = computerMove.letter
        setComputerWords([...computerWords, computerMove.word])
        setField(updatedField)
    }

    return <>
        <h2>Chosen letter: {lastSetLetter.value}</h2>
        <h2>Chosen word: {word}</h2>
        <button onClick={onResetWord}>
            Reset chosen word
        </button>
        <button onClick={onSubmitWord}>
            Submit chosen word
        </button>
        <br/>
        <Board data={field} onSelectWord={onSelectWord} onPlaceLetter={updateState} />
        <br/>
        <ScoreBoard userWords={userWords} computerWords={computerWords}/>
    </>
}

export default Game