import { Action } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import configStore from '../store/index'

// Store 类型定义
export type AppStore = ReturnType<typeof configStore>

// RootState 类型定义
export type RootState = ReturnType<AppStore['getState']>

// AppDispatch 类型定义 - 支持 thunk actions
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>

// Thunk Action 类型定义
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
