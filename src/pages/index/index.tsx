import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { setTheme } from '../../store/slices/appSlice'
import './index.css'

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
    <View className="index p-4">
      <Text className="text-3xl font-bold underline mb-4">Hello world!</Text>
      <Text className="mb-2">Current theme: {theme}</Text>
      <Text className="mb-4">System: {systemInfo?.platform || 'Unknown'}</Text>
      <Button onClick={toggleTheme} className="bg-blue-500 text-white px-4 py-2 rounded">
        Toggle Theme
      </Button>
    </View>
  )
}
