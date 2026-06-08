/**
 * TimeSimPanel.tsx — v6.5
 *
 * Time simulation debug panel.
 * - Date: +/- day buttons + display
 * - Time: slider 0:00–23:59 with clock face
 * - Toggle on/off
 * - Shows what scene would be active
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getNow,
  isSimulating,
  setSimulatedTime,
  getSimulatedTime,
} from '../lib/timeSimulator'
import { getSceneForCurrentTime, type TimeSceneOptions } from '../lib/timeScene'

interface TimeSimPanelProps {
  sceneOptions: TimeSceneOptions
  onTimeChange: () => void
}

function pad2(n: number) { return String(n).padStart(2, '0') }

function formatDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

/** Mini clock face SVG */
function ClockFace({ hours, minutes }: { hours: number; minutes: number }) {
  const hAngle = ((hours % 12) + minutes / 60) * 30 - 90
  const mAngle = minutes * 6 - 90
  const hRad = (hAngle * Math.PI) / 180
  const mRad = (mAngle * Math.PI) / 180

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(240,221,179,0.3)" strokeWidth="1.5" />
      {/* Hour marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180
        const x1 = 24 + Math.cos(a) * 18, y1 = 24 + Math.sin(a) * 18
        const x2 = 24 + Math.cos(a) * 20, y2 = 24 + Math.sin(a) * 20
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(240,221,179,0.25)" strokeWidth="1" />
      })}
      {/* Hour hand */}
      <line x1="24" y1="24" x2={24 + Math.cos(hRad) * 12} y2={24 + Math.sin(hRad) * 12}
        stroke="#f0ddb3" strokeWidth="2" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1="24" y1="24" x2={24 + Math.cos(mRad) * 16} y2={24 + Math.sin(mRad) * 16}
        stroke="#f0ddb3" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="2" fill="#f0ddb3" />
    </svg>
  )
}

const sceneLabels: Record<string, string> = {
  cover: '封面', busy: '热闹', normal: '平常', quiet: '安静',
  daytime: '备菜', nap: '午休', evening: '傍晚', night: '打烊', lightsOff: '熄灯',
}

export function TimeSimPanel({ sceneOptions, onTimeChange }: TimeSimPanelProps) {
  const [active, setActive] = useState(isSimulating)
  const [now, setNow] = useState(getNow)

  // Sync display with simulated time
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setNow(getNow()), 500)
    return () => clearInterval(id)
  }, [active])

  const toggleSim = useCallback(() => {
    if (active) {
      setSimulatedTime(null)
      setActive(false)
    } else {
      setSimulatedTime(new Date())
      setActive(true)
    }
    onTimeChange()
  }, [active, onTimeChange])

  const changeDay = useCallback((delta: number) => {
    const current = getSimulatedTime() ?? new Date()
    const next = new Date(current.getTime() + delta * 24 * 60 * 60 * 1000)
    setSimulatedTime(next)
    setNow(next)
    onTimeChange()
  }, [onTimeChange])

  const changeMinutes = useCallback((totalMinutes: number) => {
    const current = getSimulatedTime() ?? new Date()
    const next = new Date(current)
    next.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0)
    setSimulatedTime(next)
    setNow(next)
    onTimeChange()
  }, [onTimeChange])

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const predictedScene = getSceneForCurrentTime(sceneOptions)

  return (
    <div className="flex flex-col gap-3">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-[0.08em] text-ink/50">时间模拟</span>
        <button
          type="button"
          className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
            active ? 'bg-[#d4a574]/40 text-brown' : 'bg-white/25 text-ink/40'
          }`}
          onClick={toggleSim}
        >
          {active ? '● 已启用' : '○ 关闭'}
        </button>
      </div>

      {active ? (
        <>
          {/* Date + Clock */}
          <div className="flex items-center gap-3">
            <ClockFace hours={now.getHours()} minutes={now.getMinutes()} />
            <div className="flex flex-1 flex-col gap-1">
              {/* Date row */}
              <div className="flex items-center gap-2">
                <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-ink/50 transition hover:bg-white/30"
                  onClick={() => changeDay(-1)}>
                  ←
                </button>
                <span className="flex-1 text-center text-sm font-semibold text-ink/70">{formatDate(now)}</span>
                <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-ink/50 transition hover:bg-white/30"
                  onClick={() => changeDay(1)}>
                  →
                </button>
              </div>
              {/* Time display */}
              <p className="text-center text-lg font-bold tabular-nums text-ink">{formatTime(now)}</p>
            </div>
          </div>

          {/* Time slider */}
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={1439}
              step={5}
              value={currentMinutes}
              onChange={(e) => changeMinutes(parseInt(e.target.value))}
              className="h-2 w-full appearance-none rounded-full bg-white/20"
              style={{ accentColor: '#d4a574' }}
            />
            <div className="flex justify-between text-[9px] text-ink/25">
              <span>0:00</span>
              <span>6:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Predicted scene */}
          <div className="flex items-center justify-between rounded-[12px] bg-white/10 px-3 py-2">
            <span className="text-[11px] text-ink/40">当前场景</span>
            <span className="rounded-full bg-butter/50 px-2.5 py-0.5 text-[11px] font-semibold text-ink/70">
              {sceneLabels[predictedScene] ?? predictedScene}
            </span>
          </div>

          {/* Quick jumps */}
          <div className="flex gap-1.5">
            {[
              { label: '清晨', min: 7 * 60 },
              { label: '中午', min: 12 * 60 },
              { label: '傍晚', min: 18 * 60 },
              { label: '深夜', min: 23 * 60 + 30 },
            ].map((q) => (
              <button key={q.label} type="button"
                className="flex-1 rounded-full bg-white/15 py-1.5 text-[10px] text-ink/45 transition hover:bg-white/25"
                onClick={() => changeMinutes(q.min)}>
                {q.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
