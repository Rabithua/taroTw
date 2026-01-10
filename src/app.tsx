import { PropsWithChildren, useMemo, useEffect } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import configStore from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSystemInfo, setTheme } from '@/store/slices/appSlice'

import './app.css'

// 内部组件：在 Provider 内部使用 Redux hooks
function AppInner({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.app.theme)

  useLaunch(() => {
    console.log('App launched.')
    // 在应用启动时初始化数据
    try {
      const systemInfo = Taro.getSystemInfoSync()
      dispatch(setSystemInfo(systemInfo))

      // 初始化主题
      const initialTheme = systemInfo.theme === 'dark' ? 'dark' : 'light'
      dispatch(setTheme(initialTheme))
    } catch (error) {
      console.warn('Failed to get system info:', error)
      dispatch(setSystemInfo(null))
    }

    // 监听系统主题变化
    Taro.onThemeChange((res) => {
      const newTheme = res.theme === 'dark' ? 'dark' : 'light'
      dispatch(setTheme(newTheme))
    })

    // H5 环境下，Taro.onThemeChange 可能不生效，补充浏览器原生监听
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        dispatch(setTheme(e.matches ? 'dark' : 'light'))
      }
      mediaQuery.addEventListener('change', handler)
    }
  })

  // 同步主题到 DOM (H5) 和设置导航栏 (小程序)
  useEffect(() => {
    const isDark = theme === 'dark'

    // H5 环境下同步主题到 DOM
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // 小程序环境下手动设置导航栏颜色（用于覆盖 theme.json 的系统同步）
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.setNavigationBarColor({
        backgroundColor: isDark ? '#000000' : '#ffffff',
        frontColor: isDark ? '#ffffff' : '#000000',
        animation: {
          duration: 300,
          timingFunc: 'easeIn',
        },
      }).catch(() => {
        // 忽略在某些情况下（如页面未准备好）的错误
      })
    }
  }, [theme])

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
