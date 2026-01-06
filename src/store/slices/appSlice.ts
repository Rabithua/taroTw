import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  systemInfo: any
  theme: 'light' | 'dark'
}

const initialState: AppState = {
  systemInfo: null,
  theme: 'light',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSystemInfo: (state, action: PayloadAction<any>) => {
      state.systemInfo = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
  },
})

export const { setSystemInfo, setTheme } = appSlice.actions
export default appSlice.reducer
