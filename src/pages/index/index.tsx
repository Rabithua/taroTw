import { View, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { setTheme } from '../../store/slices/appSlice'

export default function Index() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.app.theme)
  const systemInfo = useAppSelector((state) => state.app.systemInfo)

  useLoad(() => {
    console.log('Page loaded.')
  })

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <View className="p-4 flex flex-col items-start justify-start space-y-4">
      <View className="text-3xl font-bold">Hello world!</View>

      <View className="w-full space-y-3">
        <View className="text-xl">Project Introduction</View>
        <View className="text-base leading-relaxed">
          This is a multi-platform development template built with Taro 4.x, Tailwind CSS 4.x, and
          Redux Toolkit. It supports WeChat Mini Program, H5, and other platforms with a modern tech
          stack.
        </View>
        <View className="text-sm space-y-1">
          <View>• Taro 4.1.9 + React 18 + TypeScript</View>
          <View>• Tailwind CSS 4.x for styling</View>
          <View>• Redux Toolkit for state management</View>
          <View>• PocketBase backend integration</View>
        </View>
      </View>

      <View className="w-full space-y-2 pt-2 border-t">
        <View>Current theme: {theme}</View>
        <View>System: {systemInfo?.platform || 'Unknown'}</View>
        <Button onClick={toggleTheme} className="mx-0 w-fit">
          Toggle Theme
        </Button>
      </View>
    </View>
  )
}
