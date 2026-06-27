/**
 * DemoPanel.tsx — 演示导航（仅演示版）
 *
 * 给路演/评审一个地方直接跳进各个时段事件，体验完整的一天，
 * 不用靠拖时间 / 等提醒。调试用的时间模拟、热点框等已从这里移除——
 * 真要 debug 时再单独挂回 TimeSimPanel。
 */

import { useT } from '../lib/i18n'

export type DemoEvent = 'morningOpening' | 'middayTransition' | 'eveningPrepare' | 'nightClosing'

interface DemoPanelProps {
  onJump: (event: DemoEvent) => void
  onReplayTour: () => void
}

const EVENTS: { key: DemoEvent; zh: string; en: string; subZh: string; subEn: string }[] = [
  { key: 'morningOpening', zh: '清晨 · 开门仪式', en: 'Dawn · Opening', subZh: '关灯一夜后开门迎客', subEn: 'Open up after a night’s rest' },
  { key: 'middayTransition', zh: '午间 · 过场', en: 'Midday · Lull', subZh: '客人散去，铺子歇晌', subEn: 'Guests leave, the shop rests' },
  { key: 'eveningPrepare', zh: '傍晚 · 预承诺', en: 'Evening · Promise', subZh: '定今晚几点关灯', subEn: 'Set tonight’s lights-off' },
  { key: 'nightClosing', zh: '夜晚 · 打烊', en: 'Night · Closing', subZh: '关灯，放下手机', subEn: 'Lights off, phone down' },
]

export function DemoPanel({ onJump, onReplayTour }: DemoPanelProps) {
  const { lang } = useT()
  const zh = lang === 'zh'

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] tracking-[0.1em] text-ink/45">{zh ? '演示 · 跳到各时段体验' : 'Demo · jump to a moment'}</p>

      <div className="grid grid-cols-2 gap-2">
        {EVENTS.map((ev) => (
          <button
            key={ev.key}
            type="button"
            className="rounded-[16px] bg-white/55 px-3 py-2.5 text-left transition hover:bg-white/75 active:scale-[0.98]"
            onClick={() => onJump(ev.key)}
          >
            <div className="text-sm font-semibold text-ink/80">{zh ? ev.zh : ev.en}</div>
            <div className="mt-0.5 text-[10px] leading-tight text-ink/40">{zh ? ev.subZh : ev.subEn}</div>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="rounded-full bg-white/35 py-1.5 text-[11px] text-ink/55 transition hover:bg-white/55"
        onClick={onReplayTour}
      >
        {zh ? '重看新手导览' : 'Replay tour'}
      </button>
    </div>
  )
}
