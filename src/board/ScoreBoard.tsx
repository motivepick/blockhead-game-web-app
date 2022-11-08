import React from 'react'
import { useAppSelector } from '../store/hooks'
import { selectAll } from '../store/reducer'

import './score-board.css'

const zip: (a: Words, b: Words) => Words[] = (a, b) => Array
    .from(Array(Math.max(a.length, b.length)).keys())
    .map(i => [i < a.length ? a[i] : '', i < b.length ? b[i] : ''])

const score: (words: Words) => number = words => words
    .map(w => w.length)
    .reduce((pw, cw) => pw + cw, 0)

const ScoreBoard = () => {
    const { wordsByUser, wordsByComputer } = useAppSelector(selectAll)

    return <table>
        <caption>Scoreboard</caption>
        <thead>
            <tr>
                <th>User</th>
                <th>Computer</th>
            </tr>
        </thead>
        <tbody>
            {
                zip(wordsByUser, wordsByComputer)
                    .map(([userWord, computerWord], i) => <tr key={`move${i}`}>
                        <td>{userWord}</td>
                        <td>{computerWord}</td>
                    </tr>)
            }
        </tbody>
        <tfoot>
            <tr>
                <td><b>Score:</b> {score(wordsByUser)}</td>
                <td><b>Score:</b> {score(wordsByComputer)}</td>
            </tr>
        </tfoot>
    </table>
}

export default ScoreBoard