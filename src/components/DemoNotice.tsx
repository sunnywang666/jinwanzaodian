/**
 * DemoNotice.tsx — 路演版首次进入的说明弹窗
 *
 * 仅在 demo 模式（isDemoMode()）显示，且每台设备只弹一次（localStorage 记住）。
 * 告知用户：当前是演示版，里面的账本/客人来访次数等是预填示例数据，不是真实记录。
 * 正式（纯净）版不含 demo 数据、也不会弹这个。见 [[demoSeed]]。
 */

import { useState } from 'react'
import { isDemoMode } from '../lib/devMode'
import { useT } from '../lib/i18n'

const SEEN_KEY = 'jinwanzaodian:demoNoticeSeen'

export function DemoNotice() {
  const { lang } = useT()
  const [show, setShow] = useState(() => {
    if (!isDemoMode()) return false
    try {
      return localStorage.getItem(SEEN_KEY) !== '1'
    } catch {
      return true
    }
  })

  if (!show) return null

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  const isEn = lang === 'en'
  const title = isEn ? 'Demo version' : '演示版'
  const body = isEn
    ? 'This is the demo build of Tonight, Sleep Early. The logbook, guest visit counts, familiarity and so on are pre-filled sample data for a quick tour — not your real records. Install the regular version to start from scratch.'
    : '这是「今晚早点」的演示版。里面的账本、客人来访次数、熟络度等都是预填的示例数据，方便快速体验，并不是你的真实记录。想从零开始，请安装正式版。'
  const ok = isEn ? 'Got it' : '我知道了'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-7"
      style={{ background: 'rgba(42,37,32,0.42)' }}
      onClick={dismiss}
    >
      <div
        className="w-full max-w-[320px] rounded-[22px] bg-[#f7efe0] p-6 text-center shadow-[0_18px_40px_rgba(54,38,26,0.34)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 inline-block rounded-full bg-[#d4a574]/25 px-3 py-1 text-[12px] font-medium text-[#8a614a]">
          {isEn ? 'DEMO' : '演示模式'}
        </div>
        <h2 className="text-[18px] font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-[13px] leading-6 text-ink/65">{body}</p>
        <button
          type="button"
          className="mt-5 w-full rounded-[16px] bg-[#d4a574]/30 py-3 text-sm font-medium text-[#8a614a] transition hover:bg-[#d4a574]/45"
          onClick={dismiss}
        >
          {ok}
        </button>
      </div>
    </div>
  )
}
