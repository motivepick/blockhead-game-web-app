import { combineSlices, configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { fetchComputerMove, fetchCreateNewField, gameSlice } from './reducer'
import { clearSavedGame, saveCompletedGame } from './persistence'

const rootReducer = combineSlices(gameSlice)

export type RootState = ReturnType<typeof rootReducer>

const createPersistenceMiddleware = () => {
    const listenerMiddleware = createListenerMiddleware()

    listenerMiddleware.startListening({
        actionCreator: fetchCreateNewField.pending,
        effect: () => {
            clearSavedGame()
        }
    })

    listenerMiddleware.startListening({
        matcher: isAnyOf(fetchCreateNewField.fulfilled, fetchComputerMove.fulfilled),
        effect: (_, listenerApi) => {
            saveCompletedGame((listenerApi.getState() as RootState).game)
        }
    })

    return listenerMiddleware.middleware
}

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
    const persistenceMiddleware = createPersistenceMiddleware()

    return configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware => {
            return getDefaultMiddleware().prepend(persistenceMiddleware)
        },
        preloadedState
    })
}

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>
