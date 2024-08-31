import {RootState} from "./store";

export const selectAll = (state: RootState) => state
export const selectField = (state: RootState) => state.field
export const selectWordsUsed = (state: RootState) => state.wordsUsed
export const selectLastSetLetterId = (state: RootState) => state.lastSetLetter.id
export const selectLastSetLetterValue = (state: RootState) => state.lastSetLetter.value
export const selectWordPath = (state: RootState): string[] => state.wordPath
export const selectComputerWordPath = (state: RootState): string[] => state.computerWordPath
export const selectComputerWordPathLength = (state: RootState): number => state.computerWordPath.length
export const selectStatus = (state: RootState): string => state.status
export const selectFieldSize = (state: RootState): number => state.fieldSize
export const selectDifficulty = (state: RootState): string => state.difficulty
export const selectHinting = (state: RootState): boolean => state.hinting
