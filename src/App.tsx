import React, { useEffect, useState } from 'react'
import { createNewField } from './api/service'
import Game from './board/Game'

const App = () => {
    const [field, setField] = useState([[]] as Field)
    useEffect(() => {
        async function createInitialField() {
            const newField = await createNewField()
            setField(newField)
        }

        createInitialField()
    }, [])

    return <>
        <h1>Hello</h1>
        {field[0].length > 0 ? <Game data={field}/> : <div/>}
    </>
}

export default App
