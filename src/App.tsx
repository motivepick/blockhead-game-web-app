import React, { useEffect, useState } from 'react'
import { createNewField } from './api/service'
import Board from './board/Board'

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
        {field[0].length > 0 ? <Board data={field}/> : <div/>}
    </>
}

export default App
