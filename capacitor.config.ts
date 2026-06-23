import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor 配置 —— 把「今晚早点」Web 构建包成 iOS / Android 原生 App。
 *
 * webDir 指向 Vite 构建产物 `dist`。打包前务必先 `npm run build`。
 */
const config: CapacitorConfig = {
  appId: 'com.jinwanzaodian.app',
  appName: '今晚早点',
  webDir: 'dist',
  backgroundColor: '#f5ead8',
  plugins: {
    LocalNotifications: {
      // Android 状态栏小图标（需在 android 资源里放一个单色 ic_stat_icon）
      smallIcon: 'ic_stat_icon',
      iconColor: '#8a614a',
    },
  },
}

export default config
