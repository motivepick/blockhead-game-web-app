import { isFieldOfSize } from '../common'

export const SAVED_GAME_STORAGE_KEY = 'savedGame'

const SAVED_GAME_VERSION = 1

type CompletedGameState = {
    fieldSize: number
    field: Field
    wordsByUser: string[]
    wordsByComputer: string[]
}

type SavedGame = CompletedGameState & {
    version: number
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(item => typeof item === 'string')

const isSavedGame = (value: unknown, fieldSize: number): value is SavedGame => {
    if (!isRecord(value)) return false

    return (
        value.version === SAVED_GAME_VERSION &&
        value.fieldSize === fieldSize &&
        isFieldOfSize(value.field, fieldSize) &&
        isStringArray(value.wordsByUser) &&
        isStringArray(value.wordsByComputer)
    )
}

export const readSavedGame = (fieldSize: number): CompletedGameState | undefined => {
    const serializedGame = localStorage.getItem(SAVED_GAME_STORAGE_KEY)
    if (!serializedGame) return undefined

    try {
        const savedGame: unknown = JSON.parse(serializedGame)
        if (isSavedGame(savedGame, fieldSize)) return savedGame

        console.warn('Ignoring an invalid saved game.')
        localStorage.removeItem(SAVED_GAME_STORAGE_KEY)
    } catch (error) {
        console.warn('Ignoring a saved game that could not be read.', error)
        localStorage.removeItem(SAVED_GAME_STORAGE_KEY)
    }

    return undefined
}

export const saveCompletedGame = (state: CompletedGameState) => {
    if (!isFieldOfSize(state.field, state.fieldSize)) {
        throw new Error('Cannot save a game with an invalid field.')
    }

    const savedGame: SavedGame = {
        version: SAVED_GAME_VERSION,
        fieldSize: state.fieldSize,
        field: state.field,
        wordsByUser: state.wordsByUser,
        wordsByComputer: state.wordsByComputer
    }

    localStorage.setItem(SAVED_GAME_STORAGE_KEY, JSON.stringify(savedGame))
}

export const clearSavedGame = () => {
    localStorage.removeItem(SAVED_GAME_STORAGE_KEY)
}
