/**
 * ShopGuests.tsx — 铺子里活着的客人层
 *
 * 渲染在 ShopSceneInteractive 的等比容器内部（与背景图、物件按钮同一坐标系），
 * 负责让首页的铺子"活起来"：
 *  - 客人坐在垫子/凳子上，呼吸式浮动 + 偶尔左右挪动（不只是上下）
 *  - playArrival=true 时播放「出餐迎客」：开门灯亮 → 客人错开走进来冒想法
 *    → 精灵端出真餐点 → 安定；播完回调 onArrivalComplete
 *  - 点客人 → 弹出 TA 的资料卡（名字 / 熟络度 / 来访次数 / 爱吃）
 *  - 点精灵 → onSpiritTap（接精灵对话）
 *
 * 纯展示组件：客人是谁、几位，由父级用 guestKeys 决定（按昨晚作息在 App 里 roll）。
 * 真实来访次数/熟络度可由 guestProgress 传入覆盖，否则回退到图鉴默认值。
 */

import { useEffect, useRef, useState } from 'react'
import { dishes as allDishes } from '../lib/demoData'
import { guestReferences as allGuests } from '../lib/guestReferences'
import { getFamiliarityLabel, type FamiliarityLevel } from '../lib/guestProgression'
import { SpiritSprite } from './SpiritSprite'
import type { SpiritForm } from '../lib/storage'

interface GuestProgressLite {
  totalVisits: number
  familiarityLevel: FamiliarityLevel
}

interface ShopGuestsProps {
  guestKeys: string[]
  playArrival?: boolean
  onArrivalComplete?: () => void
  spiritName?: string
  /** 当前选择的精灵形态（皮肤） */
  spiritForm?: SpiritForm
  onSpiritTap?: () => void
  guestProgress?: Record<string, GuestProgressLite>
}

/** 座位（占等比容器的百分比）：左凳 / 圆桌 / 右凳 / 桌后，最多 4 位 */
const SEATS = [
  { left: '1%', top: '57%', w: '20%', side: 'left' as const },
  { left: '39%', top: '62%', w: '22%', side: 'right' as const },
  { left: '78%', top: '57%', w: '20%', side: 'right' as const },
  { left: '24%', top: '52%', w: '18%', side: 'left' as const },
]

/** 出餐迎客动画时序（毫秒），抽成常量便于调 */
const ARRIVAL = {
  opening: 80,        // 开门灯亮
  enterStart: 1000,   // 客人开始走进来
  firstGuest: 300,    // 第一位相对 enterStart 的延迟
  guestStagger: 1000, // 每位客人间隔
  beforeServe: 300,   // 全部进来到开始上菜
  serveStart: 500,    // serving 相位到第一道菜
  serveStagger: 450,  // 每道菜间隔
  settle: 500,        // 最后一道菜到安定
}

/** 想法 emoji（按爱吃猜一个，纯氛围） */
const THOUGHT: Record<string, string> = {
  cat: '🐟', fox: '🥣', rabbit: '🍵', bear: '🥟', raccoon: '🥛', sparrow: '🥚', bird: '🥛',
  spirit1: '🥛', spirit2: '🥟', spirit3: '🥣', spiritFamily1_1: '🥢',
}

/** 按客人爱吃的食物挑一份要端上的餐点 */
function dishForGuest(favoriteFood: string) {
  const hit = allDishes.find((d) => favoriteFood.includes(d.name) || d.name.includes(favoriteFood))
  return (hit ?? allDishes[0]).image
}

const KEYFRAMES = `
@keyframes sg-breathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes sg-waddle { 0%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} 100%{transform:rotate(-5deg)} }
@keyframes sg-steam { 0%{opacity:0;transform:translateY(3px) scaleY(.7)} 45%{opacity:.65} 100%{opacity:0;transform:translateY(-13px) scaleY(1.3)} }
@keyframes sg-thought { 0%{opacity:0;transform:translate(-50%,4px) scale(.5)} 70%{transform:translate(-50%,0) scale(1.12)} 100%{opacity:1;transform:translate(-50%,0) scale(1)} }
@keyframes sg-pop { 0%{opacity:0;transform:translateY(10px) scale(.96)} 100%{opacity:1;transform:translateY(0) scale(1)} }
@keyframes sg-stretch { 0%,100%{transform:scaleY(1)} 45%{transform:scaleY(1.14) translateY(-5px)} }
@keyframes sg-glow { 0%{opacity:0;transform:translate(-50%,-50%) scale(.7)} 40%{opacity:1} 100%{opacity:.5;transform:translate(-50%,-50%) scale(1)} }
`

type Phase = 'dark' | 'opening' | 'enter' | 'serving' | 'settled'

export function ShopGuests({
  guestKeys,
  playArrival = false,
  onArrivalComplete,
  spiritName = '阿团',
  spiritForm = 'base',
  onSpiritTap,
  guestProgress,
}: ShopGuestsProps) {
  const present = guestKeys
    .map((key) => allGuests.find((g) => g.key === key))
    .filter((g): g is (typeof allGuests)[number] => Boolean(g))
    .slice(0, SEATS.length)

  const [phase, setPhase] = useState<Phase>(playArrival ? 'dark' : 'settled')
  const [arrived, setArrived] = useState<number>(playArrival ? 0 : present.length)
  const [served, setServed] = useState<number>(playArrival ? 0 : present.length)
  const [selected, setSelected] = useState<string | null>(null)
  const [wander, setWander] = useState<Record<number, number>>({})
  const timers = useRef<number[]>([])

  // 出餐迎客播放
  useEffect(() => {
    if (!playArrival) return
    const at = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)) }
    setPhase('dark'); setArrived(0); setServed(0)
    at(ARRIVAL.opening, () => setPhase('opening'))
    at(ARRIVAL.enterStart, () => setPhase('enter'))
    present.forEach((_, i) => at(ARRIVAL.enterStart + ARRIVAL.firstGuest + i * ARRIVAL.guestStagger, () => setArrived(i + 1)))
    const allIn = ARRIVAL.enterStart + ARRIVAL.firstGuest + present.length * ARRIVAL.guestStagger + ARRIVAL.beforeServe
    at(allIn, () => setPhase('serving'))
    present.forEach((_, i) => at(allIn + ARRIVAL.serveStart + i * ARRIVAL.serveStagger, () => setServed(i + 1)))
    at(allIn + ARRIVAL.serveStart + present.length * ARRIVAL.serveStagger + ARRIVAL.settle, () => { setPhase('settled'); onArrivalComplete?.() })
    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playArrival, guestKeys.join(',')])

  // 偶尔左右挪一下
  useEffect(() => {
    if (present.length === 0) return
    const id = window.setInterval(() => {
      const i = Math.floor(Math.random() * present.length)
      setWander((w) => ({ ...w, [i]: (Math.random() * 14 - 7) }))
    }, 2600)
    return () => clearInterval(id)
  }, [present.length])

  if (present.length === 0) return null

  const opened = phase !== 'dark' && phase !== 'opening'
  const serving = phase === 'serving' || phase === 'settled'
  const sel = selected ? allGuests.find((g) => g.key === selected) : null
  const selProg = sel ? guestProgress?.[sel.key] : undefined
  const selVisits = selProg?.totalVisits ?? 0
  const selStatus = selProg ? getFamiliarityLabel(selProg.familiarityLevel) : '新客'

  return (
    <div className="pointer-events-none absolute inset-0 z-[8]">
      <style>{KEYFRAMES}</style>

      {/* 开门灯晕 */}
      {phase === 'opening' ? (
        <div
          className="absolute left-1/2 top-[34%] h-[42%] w-[62%] rounded-full"
          style={{ transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(250,224,156,0.5) 0%, rgba(245,234,216,0.12) 60%, transparent 100%)', animation: 'sg-glow .9s ease-out both' }}
        />
      ) : null}

      {/* 开门前暗罩 */}
      {playArrival ? (
        <div className="absolute inset-0" style={{ background: '#2a2520', opacity: opened ? 0 : 0.5, transition: 'opacity .9s ease' }} />
      ) : null}

      {/* 精灵 */}
      <button
        type="button"
        className="pointer-events-auto absolute"
        style={{ left: '8%', top: '31%', width: '13%', border: 'none', background: 'transparent', padding: 0, cursor: onSpiritTap ? 'pointer' : 'default',
          filter: phase === 'dark' ? 'brightness(.7) saturate(.7)' : 'none', transition: 'filter .8s',
          animation: phase === 'opening' ? 'sg-stretch .9s ease' : (serving ? 'none' : 'sg-breathe 4s ease-in-out infinite') }}
        onClick={() => onSpiritTap?.()}
        aria-label={spiritName}
      >
        <SpiritSprite body={spiritForm} face="normal" alt={spiritName} className="w-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(138,97,74,0.2))' }} />
        {serving ? (
          <div className="absolute left-1/2 top-[-8px] flex -translate-x-1/2 gap-[3px]">
            {[0, 0.35, 0.7].map((d, k) => (
              <span key={k} style={{ width: 4, height: 15, background: 'rgba(255,255,255,.7)', borderRadius: 99, animation: `sg-steam 1.3s ease-out ${d}s infinite` }} />
            ))}
          </div>
        ) : null}
      </button>

      {/* 餐点 */}
      {present.map((g, i) => {
        const seat = SEATS[i]
        const show = served >= i + 1
        const dish = dishForGuest(g.favoriteFood)
        return (
          <img
            key={`dish-${g.key}`}
            src={dish.src}
            alt=""
            onError={(e) => { if (dish.fallbackSrc) (e.target as HTMLImageElement).src = dish.fallbackSrc }}
            style={{ position: 'absolute', left: `calc(${seat.left} + 6%)`, top: `calc(${seat.top} + 16%)`, width: '12%', aspectRatio: '1.15', objectFit: 'contain', zIndex: 7,
              opacity: show ? 1 : 0, transform: show ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(.6)',
              transition: 'opacity .4s, transform .4s cubic-bezier(.34,1.56,.64,1)', filter: 'drop-shadow(0 3px 6px rgba(54,38,26,0.2))', pointerEvents: 'none' }}
          />
        )
      })}

      {/* 客人 */}
      {present.map((g, i) => {
        const seat = SEATS[i]
        const isIn = arrived >= i + 1
        const off = seat.side === 'left' ? '-130%' : '140%'
        const tx = isIn ? `${wander[i] ?? 0}px` : off
        return (
          <button
            key={g.key}
            type="button"
            className="pointer-events-auto absolute"
            style={{ left: seat.left, top: seat.top, width: seat.w, zIndex: 8, border: 'none', background: 'transparent', padding: 0,
              cursor: isIn ? 'pointer' : 'default', transform: `translateX(${tx})`, opacity: isIn ? 1 : 0,
              transition: 'transform 1s cubic-bezier(.25,.6,.3,1), opacity .6s' }}
            onClick={() => { if (isIn) setSelected(g.key) }}
            aria-label={g.name}
          >
            {isIn ? (
              <div className="absolute left-1/2 top-[-16px] -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-[7px] py-[2px] text-[13px] shadow-[0_2px_6px_rgba(54,38,26,.2)]" style={{ animation: 'sg-thought .4s ease-out' }}>
                {THOUGHT[g.key] ?? '🥢'}
              </div>
            ) : null}
            <div style={{ animation: isIn ? `sg-breathe 3.2s ease-in-out ${i * 0.3}s infinite` : 'sg-waddle .35s ease-in-out infinite', transformOrigin: 'bottom center' }}>
              <img src={g.image.src} alt={g.name} style={{ width: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 7px rgba(54,38,26,0.22))' }}
                onError={(e) => { if (g.image.fallbackSrc) (e.target as HTMLImageElement).src = g.image.fallbackSrc }} />
            </div>
          </button>
        )
      })}

      {/* 客人资料卡 */}
      {sel ? (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center px-7" style={{ zIndex: 50, background: 'rgba(42,37,32,0.34)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-[286px] rounded-[22px] bg-[#f7efe0] p-[18px] text-center shadow-[0_14px_32px_rgba(54,38,26,0.3)]" style={{ animation: 'sg-pop .3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            <img src={sel.image.src} alt={sel.name} className="mx-auto h-[84px] object-contain" style={{ filter: 'drop-shadow(0 4px 9px rgba(54,38,26,.18))' }}
              onError={(e) => { if (sel.image.fallbackSrc) (e.target as HTMLImageElement).src = sel.image.fallbackSrc }} />
            <div className="mt-2 flex items-center justify-center gap-2">
              <h3 className="text-[17px] font-semibold text-ink">{sel.name}</h3>
              <span className="rounded-full bg-[#d4a574]/25 px-[9px] py-[2px] text-[11px] font-medium text-[#8a614a]">{selStatus}</span>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-ink/65">{sel.description}</p>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 rounded-xl bg-white/60 p-2">
                <div className="text-[10px] text-ink/40">来访</div>
                <div className="text-[14px] font-semibold text-ink">{selVisits} 次</div>
              </div>
              <div className="flex-1 rounded-xl bg-white/60 p-2">
                <div className="text-[10px] text-ink/40">爱吃</div>
                <div className="truncate text-[14px] font-semibold text-ink">{sel.favoriteFood}</div>
              </div>
            </div>
            <button type="button" className="mt-[14px] text-[13px] text-ink/45" onClick={() => setSelected(null)}>关上</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
