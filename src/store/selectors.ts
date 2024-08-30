import {RootState} from "./store";

export const selectAll = (state: RootState) => state
export const selectField = (state: RootState) => state.field
export const selectLastSetLetterId = (state: RootState) => state.lastSetLetter.id
export const selectLastSetLetterValue = (state: RootState) => state.lastSetLetter.value
export const selectWordPath = (state: RootState): string[] => state.wordPath
