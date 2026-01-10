import { useAppSelector } from '@/store/hooks'

export function useThemeViewProps() {
  const theme = useAppSelector((state) => state.app.theme)
  const systemInfo = useAppSelector((state) => state.app.systemInfo)

  // 返回适合传给页面根 View 的 className
  const themeClass = theme === 'dark' ? 'dark' : ''

  const themeStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
    color: 'var(--foreground)',
  }

  return { themeClass, themeStyle, theme, systemInfo }
}
