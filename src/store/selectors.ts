import {RootState} from "./store";

export const selectField = (state: RootState) => state.field
export const selectUsedWords = (state: RootState) => {
    const field = selectField(state);
    return [field[Math.floor(field.length / 2)].join('')].concat(selectWordsByUser(state)).concat(selectWordsByComputer(state));
}
export const selectLastSetLetterId = (state: RootState): Cell => state.lastSetLetter.id
export const selectWordPath = (state: RootState): Cell[] => state.wordPath
export const selectComputerWordPath = (state: RootState): Cell[] => state.computerWordPath
export const selectComputerWordPathLength = (state: RootState): number => state.computerWordPath.length
export const selectStatus = (state: RootState): string => state.status
export const selectFieldSize = (state: RootState): number => state.fieldSize
export const selectDifficulty = (state: RootState): string => state.difficulty
export const selectHinting = (state: RootState): boolean => state.hinting
export const selectWordsByUser = (state: RootState): string[] => state.wordsByUser
export const selectWordsByComputer = (state: RootState): string[] => state.wordsByComputer
export const selectErrors = (state: RootState): string[] => state.errors
