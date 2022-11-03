import React from 'react'
import Board from "./board/Board";

const field = [ "Т....", "ЕГТЫН", "БАЛДА", ".ФЛАХ", "....." ].map(row => row.split(""))

const App = () => <>
    <h1>Hello</h1>
    <Board data={field}/>
</>

export default App
