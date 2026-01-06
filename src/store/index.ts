import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
// import groupReducer from "./slices/groupSlice";

export default function configStore() {
  const store = configureStore({
    reducer: {
      user: userReducer,
      app: appReducer,
      // group: groupReducer,
    },
    middleware: (getDefaultMiddleware) => {
      const middlewares = getDefaultMiddleware({
        // 禁用 thunk 的 extraArgument，避免使用 AbortController
        thunk: {
          extraArgument: undefined,
        },
      })
      // 开发环境添加 redux-logger
      if (process.env.NODE_ENV === 'development') {
        middlewares.push(createLogger())
      }
      return middlewares
    },
    devTools: process.env.NODE_ENV === 'development',
  })
  return store
}
