/**
 * widget.ts — 桌面小组件桥（仅安卓原生有效）
 *
 * 把"今晚关灯时间"写进原生 SharedPreferences 并刷新桌面组件。
 * Web / 非安卓平台静默跳过。原生实现见 android 的 ZaodianWidgetPlugin。
 */

import { registerPlugin, Capacitor } from '@capacitor/core'

interface ZaodianWidgetPlugin {
  update(options: { lightsOff: string }): Promise<void>
}

const ZaodianWidget = registerPlugin<ZaodianWidgetPlugin>('ZaodianWidget')

export function updateWidget(lightsOff: string): void {
  if (Capacitor.getPlatform() !== 'android') return
  ZaodianWidget.update({ lightsOff }).catch(() => {
    /* 没装组件 / 调用失败都不影响 app */
  })
}
