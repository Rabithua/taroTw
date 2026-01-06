import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../types/store'

// 类型安全的 useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 类型安全的 useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
