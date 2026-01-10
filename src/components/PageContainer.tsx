import { View, ViewProps } from '@tarojs/components'
import React from 'react'
import { useThemeViewProps } from '@/hooks/useTheme'

interface Props extends ViewProps {
  children: React.ReactNode
}

/**
 * 通用页面容器组件
 * 自动处理小程序和 H5 的深色模式类名与背景色同步
 */
export default function PageContainer({ children, className = '', style, ...rest }: Props) {
  const { themeClass, themeStyle } = useThemeViewProps()

  // 合并类名与样式
  const combinedClassName = `min-h-screen ${themeClass} ${className}`.trim()
  const combinedStyle = {
    ...themeStyle,
    ...((style as React.CSSProperties) || {}),
  }

  return (
    <View {...rest} className={combinedClassName} style={combinedStyle}>
      {children}
    </View>
  )
}
