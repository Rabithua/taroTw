import { PropsWithChildren, useMemo } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import configStore from './store'
import { useAppDispatch } from './store/hooks'
import { setSystemInfo } from './store/slices/appSlice'

import './app.css'

// 内部组件：在 Provider 内部使用 Redux hooks
function AppInner({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()

  useLaunch(() => {
    console.log('App launched.')
    // 在应用启动时初始化数据
    try {
      const systemInfo = Taro.getSystemInfoSync()
      dispatch(setSystemInfo(systemInfo))
    } catch (error) {
      console.warn('Failed to get system info:', error)
      // 在 H5 环境下，如果获取系统信息失败，使用默认值
      dispatch(setSystemInfo(null))
    }
  })

  // children 是将要会渲染的页面
  return children
}

function App({ children }: PropsWithChildren<any>) {
  // 使用 useMemo 延迟初始化 store，避免在模块顶层初始化
  const store = useMemo(() => configStore(), [])

  return (
    <Provider store={store}>
      <AppInner>{children}</AppInner>
    </Provider>
  )
}

export default App
