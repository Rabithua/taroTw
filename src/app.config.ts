export default defineAppConfig({
  pages: ['pages/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '@navBackgroundColor',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: '@navTextStyle',
  },
  darkmode: true,
  themeLocation: 'theme.json',
})
