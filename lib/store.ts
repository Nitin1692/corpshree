import { configureStore } from '@reduxjs/toolkit'
import companyReducer from './features/companyIdSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        company: companyReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']