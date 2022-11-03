import React from 'react'
import Board from "./board/Board";

const field = [ "Т....", "ЕГТЫН", "БАЛДА", ".ФЛАХ", "....." ]

const App = () => <>
    <h1>Hello</h1>
    <Board data={field.map(row => row.split(""))}/>
</>

export default App
