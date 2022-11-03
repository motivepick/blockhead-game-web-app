import React from 'react'
import './board.css'

type TCell = {
    id: string,
    letter: string,
    value: string,
    onChange: (smth: any) => void
}

const Cell = ({ id, letter, value, onChange }: TCell) => <td>{letter !== "." ? letter :
    <input id={id} type="text" maxLength={1} value={value === "." ? "" : value} onChange={onChange}/>
}</td>

export default Cell