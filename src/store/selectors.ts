import {RootState} from "./store";

export const selectField = (state: RootState) => state.field
export const selectUsedWords = (state: RootState) => {
    const field = selectField(state)
    return [field[Math.floor(field.length / 2)].join('')].concat(selectWordsByUser(state)).concat(selectWordsByComputer(state));
}
export const selectUncommittedCell = (state: RootState): Cell => state.uncommitedCell
export const selectWord = (state: RootState): string => {
    const field = selectField(state)
    return state.uncommittedUserWord.map(([x, y]) => field[x][y]).join('')
}
export const selectUncommittedUserWord = (state: RootState): Cell[] => state.uncommittedUserWord
export const selectUncommittedComputerWord = (state: RootState): Cell[] => state.uncommittedComputerWord
export const selectStatus = (state: RootState): string => state.status
export const selectFieldSize = (state: RootState): number => state.fieldSize
export const selectDifficulty = (state: RootState): string => state.difficulty
export const selectHinting = (state: RootState): boolean => state.hinting
export const selectWordsByUser = (state: RootState): string[] => state.wordsByUser
export const selectWordsByComputer = (state: RootState): string[] => state.wordsByComputer
export const selectErrors = (state: RootState): UserError[] => state.errors
