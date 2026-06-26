import { useEffect, useRef, useState } from 'react'

/**
 * ClockOverlay — 首页墙上的指针挂钟（盖住背景里画的钟）。
 * 位置/大小存在 localStorage，调试模式(debug)下可直接拖动 + 按钮调大小，
 * 调到正好盖住背景的钟即可，数值自动保存，下次进来就用调好的。
 */

const STORAGE_KEY = 'zaodian_clock_pos'
const DEFAULT_POS = { left: 45.1, top: 13.8, width: 12.7 }

interface ClockPos { left: number; top: number; width: number }

function loadPos(): ClockPos {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (typeof p?.left === 'number' && typeof p?.top === 'number' && typeof p?.width === 'number') return p
    }
  } catch { /* ignore */ }
  return DEFAULT_POS
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

export function ClockOverlay({ debug = false }: { debug?: boolean }) {
  const [time, setTime] = useState(() => new Date())
  const [pos, setPos] = useState<ClockPos>(loadPos)
  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)) } catch { /* ignore */ }
  }, [pos])

  // 调试模式：拖动改位置
  useEffect(() => {
    if (!debug) return
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      const parent = rootRef.current?.offsetParent as HTMLElement | null
      if (!parent) return
      const r = parent.getBoundingClientRect()
      setPos((p) => ({
        ...p,
        left: clamp(((e.clientX - r.left) / r.width) * 100, 0, 100),
        top: clamp(((e.clientY - r.top) / r.height) * 100, 0, 100),
      }))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [debug])

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const hourAngle = (hours + minutes / 60) * 30
  const minuteAngle = (minutes + seconds / 60) * 6
  const secondAngle = seconds * 6

  const nudgeWidth = (d: number) => setPos((p) => ({ ...p, width: clamp(+(p.width + d).toFixed(2), 2, 40) }))

  return (
    <>
      <div
        ref={rootRef}
        className="absolute"
        onPointerDown={debug ? () => { dragging.current = true } : undefined}
        style={{
          left: `${pos.left}%`,
          top: `${pos.top}%`,
          width: `${pos.width}%`,
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
          zIndex: debug ? 40 : 2,
          pointerEvents: debug ? 'auto' : 'none',
          cursor: debug ? 'move' : 'default',
          outline: debug ? '2px dashed rgba(176,122,86,0.9)' : 'none',
          touchAction: 'none',
        }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* 表盘底：不透明，盖住背景墙上画的钟（含它的分针秒针），避免两个钟重影 */}
          <circle cx="50" cy="50" r="42" fill="#f5ead4" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#d8c4a4" strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1="50" y1="16" x2="50" y2={angle % 90 === 0 ? '21' : '19'}
              stroke="#7a6354" strokeWidth={angle % 90 === 0 ? '2' : '1.2'}
              strokeLinecap="round" transform={`rotate(${angle}, 50, 50)`} opacity="0.55"
            />
          ))}
          <line x1="50" y1="52" x2="50" y2="28" stroke="#5c4a3a" strokeWidth="3.2" strokeLinecap="round" transform={`rotate(${hourAngle}, 50, 50)`} />
          <line x1="50" y1="53" x2="50" y2="20" stroke="#5c4a3a" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${minuteAngle}, 50, 50)`} />
          <line x1="50" y1="56" x2="50" y2="18" stroke="#b07a56" strokeWidth="0.9" strokeLinecap="round" transform={`rotate(${secondAngle}, 50, 50)`} opacity="0.65" />
          <circle cx="50" cy="50" r="2.8" fill="#5c4a3a" />
          <circle cx="50" cy="50" r="1.2" fill="#8a6e58" />
        </svg>
      </div>

      {debug ? (
        <div
          className="absolute bottom-[2%] left-[2%] z-50 flex items-center gap-2 rounded-xl bg-ink/80 px-2.5 py-1.5 text-[11px] text-paper"
          style={{ pointerEvents: 'auto' }}
        >
          <span>钟 拖动移动</span>
          <button type="button" className="h-6 w-6 rounded-full bg-paper/25 text-base leading-none" onClick={() => nudgeWidth(-0.3)}>−</button>
          <button type="button" className="h-6 w-6 rounded-full bg-paper/25 text-base leading-none" onClick={() => nudgeWidth(0.3)}>＋</button>
          <span className="tabular-nums">L{pos.left.toFixed(1)} T{pos.top.toFixed(1)} W{pos.width.toFixed(1)}</span>
          <button type="button" className="rounded-full bg-paper/20 px-2 py-0.5" onClick={() => setPos(DEFAULT_POS)}>复位</button>
        </div>
      ) : null}
    </>
  )
}
