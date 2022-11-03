import React from 'react'
import './board.css'

const EditableCell = <input type="text" maxLength={1} onChange={() => console.log("click")} />

const Cell = (letter: string) => <td>{letter !== "." ? letter : EditableCell}</td>

export default Cell