import React from 'react'
import {TEXT_COLOR} from "../const"
import {selectScoreByComputer, selectScoreByUser, selectWordsByComputer, selectWordsByUser} from "../store/selectors"
import {useSelector} from "react-redux"

const zip: (a: Words, b: Words) => Words[] = (a, b) => Array
    .from(Array(Math.max(a.length, b.length)).keys())
    .map(i => [i < a.length ? a[i] : '', i < b.length ? b[i] : ''])

const ScoreBoard = () => {
    const wordsByUser = useSelector(selectWordsByUser)
    const scoreByUser = useSelector(selectScoreByUser)
    const wordsByComputer = useSelector(selectWordsByComputer)
    const scoreByComputer = useSelector(selectScoreByComputer)

    return (
        <table className="min-w-full">
            <caption className={TEXT_COLOR}>Scoreboard</caption>
            <thead
                className="border-b  bg-indigo-100 border-indigo-200 dark:bg-slate-700 dark:border-slate-600">
            <tr>
                <th scope="col" className="text-sm font-bold text-gray-900 dark:text-gray-400 px-6 py-4">
                    User
                </th>
                <th scope="col" className="text-sm font-bold text-gray-900 dark:text-gray-400 px-6 py-4">
                    Computer
                </th>
            </tr>
            </thead>
            <tbody>
            {
                zip(wordsByUser, wordsByComputer)
                    .map(([userWord, computerWord], i) => <tr className="border-b  dark:border-slate-600"
                                                              key={`move${i}`}>
                        <td className="text-sm text-gray-900 dark:text-gray-200 font-medium px-6 py-4 whitespace-nowrap">{userWord}</td>
                        <td className="text-sm text-gray-900 dark:text-gray-200 font-medium px-6 py-4 whitespace-nowrap">{computerWord}</td>
                    </tr>)
            }
            </tbody>
            <tfoot>
            <tr>
                <td className="text-sm text-gray-900 dark:text-gray-200 px-6 py-4 whitespace-nowrap">
                    <b>Score:</b> {scoreByUser}</td>
                <td className="text-sm text-gray-900 dark:text-gray-200 px-6 py-4 whitespace-nowrap">
                    <b>Score:</b> {scoreByComputer}</td>
            </tr>
            </tfoot>
        </table>
    )
}

export default ScoreBoard