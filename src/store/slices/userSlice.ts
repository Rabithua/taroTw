import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '@/types/user'

interface UserState {
  userInfo: UserInfo | null
  isLogin: boolean
  token: string
}

const initialState: UserState = {
  userInfo: null,
  isLogin: false,
  token: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload
      state.isLogin = !!action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isLogin = !!action.payload
    },
    clearUser: (state) => {
      state.userInfo = null
      state.token = ''
      state.isLogin = false
    },
  },
})

export const { setUserInfo, setToken, clearUser } = userSlice.actions
export default userSlice.reducer
