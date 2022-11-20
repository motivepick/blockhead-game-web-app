// @ts-nocheck
import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
    fetchComputerMove,
    userMove,
    selectAll,
    resetWord,
    fetchHint
} from '../store/reducer'
import Board from './Board'
import ScoreBoard from './ScoreBoard'


const Game = () => {
    const allState = useAppSelector(selectAll)
    const dispatch = useAppDispatch()

    const onSubmitWord = async () => {
        if (allState.error) return
        dispatch(userMove())
        dispatch(fetchComputerMove())
    }

    const onResetWord = () => dispatch(resetWord())

    const onHint = () => dispatch(fetchHint())

    return <div>
        <div className="grid grid-cols-5 gap-3">
            <div/>
            <div className="col-span-3">
                <div className="grid grid-flow-row auto-rows-max">
                    <Board/>
                    <br/>
                    {allState.error &&
                        <p className="h-10 px-6 font-semibold rounded-md text-red-900 dark:text-red-400">Error: {allState.error}</p>}
                    <h2 className="font-medium leading-tight text-3xl mt-0 mb-2">Chosen
                        letter: {allState.lastSetLetter.value}</h2>
                    <h2 className="font-medium leading-tight text-3xl mt-0 mb-2">Chosen word: {allState.word}</h2>
                    <br/>
                    <>
                        <button
                            className="h-10 px-6 font-semibold rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-gray-200"
                            type="button" onClick={onSubmitWord}>Submit chosen word
                        </button>
                        <button
                            className="h-10 px-6 font-semibold rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-gray-200"
                            type="button" onClick={onResetWord}>Reset chosen word
                        </button>
                        <button
                            className="h-10 px-6 font-semibold rounded-md border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-gray-200"
                            type="button" onClick={onHint}>Hint
                        </button>
                    </>
                </div>
            </div>
            <div>
                <ScoreBoard/>
            </div>
        </div>
    </div>
}

export default Game