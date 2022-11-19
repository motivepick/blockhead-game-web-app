import React from 'react'
import { useAppSelector } from '../store/hooks'
import { selectAll } from '../store/reducer'

const zip: (a: Words, b: Words) => Words[] = (a, b) => Array
    .from(Array(Math.max(a.length, b.length)).keys())
    .map(i => [i < a.length ? a[i] : '', i < b.length ? b[i] : ''])

const ScoreBoard = () => {
    const { wordsByUser, scoreByUser, wordsByComputer, scoreByComputer } = useAppSelector(selectAll)

    return <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <caption>Scoreboard</caption>
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
                </div>
            </div>
        </div>
    </div>
}

export default ScoreBoard