// @ts-nocheck
import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchComputerMove, userMove, selectAll, resetWord } from '../store/reducer'
import store from '../store/store'
import Board from './Board'
import ScoreBoard from './ScoreBoard'


const Game = () => {
    const allState = useAppSelector(selectAll)
    const dispatch = useAppDispatch()

    const onSubmitWord = async () => {
        if(allState.error) return
        dispatch(userMove({ word: allState.word.join('') }))
        const { field, wordsUsed } = store.getState()
        dispatch(fetchComputerMove({ field, wordsUsed }))
    }

    return <div>
        <div className="grid grid-cols-5 gap-3">
            <div/>
            <div className="col-span-3">
                <div className="grid grid-flow-row auto-rows-max">
                    <Board/>
                    <br/>
                    {allState.error &&
                        <p className="h-10 px-6 font-semibold rounded-md text-red-900">Error: {allState.error}</p>}
                    <h2 className="font-medium leading-tight text-3xl mt-0 mb-2">Chosen
                        letter: {allState.lastSetLetter.value}</h2>
                    <h2 className="font-medium leading-tight text-3xl mt-0 mb-2">Chosen word: {allState.word}</h2>
                    <br/>
                    <>
                        <button className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-900"
                                type="button" onClick={onSubmitWord}>Submit chosen word
                        </button>
                        <button className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-900"
                                type="button" onClick={() => dispatch(resetWord())}>Reset chosen word
                        </button>
                    </>
                </div>
            </div>
            <div className="some-class"><ScoreBoard/></div>
        </div>
    </div>
}

export default Game