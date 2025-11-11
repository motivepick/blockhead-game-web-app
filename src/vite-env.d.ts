/// <reference types="vite/client" />
type Field = string[][]
type Words = string[]

type Pair<A, B> = [A, B]

type Cell = Pair<number, number>

type UserError = {
    id: string
    messageKey: string
}

type ComputerMoveResponse = {
    cell: Cell
    letter: string
    path: Cell[]
    word: string
    success: boolean
}
