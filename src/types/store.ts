import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import configStore from '@/store/index'

// Store 类型定义
export type AppStore = ReturnType<typeof configStore>

// RootState 类型定义
export type RootState = ReturnType<AppStore['getState']>

// AppDispatch 类型定义 - 使用 store 的 dispatch 类型（Redux Toolkit 已内置 thunk 支持）
export type AppDispatch = AppStore['dispatch']

// Thunk Action 类型定义
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
