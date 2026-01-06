import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import configStore from './store'
import { useAppDispatch } from './store/hooks'
import { setSystemInfo } from './store/slices/appSlice'

import './app.css'

const store = configStore()

// 内部组件：在 Provider 内部使用 Redux hooks
function AppInner({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()

  useLaunch(() => {
    console.log('App launched.')
    // 在应用启动时初始化数据
    const systemInfo = Taro.getSystemInfoSync()
    dispatch(setSystemInfo(systemInfo))
  })

  // children 是将要会渲染的页面
  return children
}

function App({ children }: PropsWithChildren<any>) {
  return (
    <Provider store={store}>
      <AppInner>{children}</AppInner>
    </Provider>
  )
}

export default App
