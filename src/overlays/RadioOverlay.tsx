/**
 * RadioOverlay.tsx — v6.1
 *
 * Audio engine moved to App-level (lib/ambientAudio.ts).
 * This component receives audio controls as props — no longer manages its own AudioContext.
 * Audio continues playing after closing the overlay.
 */

import { useState, useRef, useEffect } from 'react'
import { toolAssets } from '../lib/assets'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { CHANNELS, TIMER_OPTIONS, type AmbientAudioControls } from '../lib/ambientAudio'
import { useT } from '../lib/i18n'

interface RadioOverlayProps {
  audio: AmbientAudioControls
  onClose: () => void
}

/* ── Breathing guide ── */

function BreathingGuide({ active }: { active: boolean }) {
  const { t } = useT()
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active) return
    const durations = { inhale: 4000, hold: 4000, exhale: 6000 }
    const sequence: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale']
    let idx = 0
    let start = Date.now()
    setPhase('inhale')
    setProgress(0)

    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const dur = durations[sequence[idx]]
      if (elapsed >= dur) {
        idx = (idx + 1) % 3
        start = Date.now()
        setPhase(sequence[idx])
        setProgress(0)
      } else {
        setProgress(elapsed / dur)
      }
    }, 50)
    return () => clearInterval(id)
  }, [active])

  if (!active) return null

  const scale =
    phase === 'inhale' ? 0.6 + progress * 0.4
    : phase === 'hold' ? 1.0
    : 1.0 - progress * 0.4

  const labels = { inhale: t('radio.inhale'), hold: t('radio.hold'), exhale: t('radio.exhale') }

  return (
    <div className="flex flex-col items-center py-3">
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 96, height: 96,
          transform: `scale(${scale})`,
          transition: 'transform 80ms linear',
          background: 'radial-gradient(circle, rgba(207,216,192,0.45) 0%, rgba(207,216,192,0.1) 70%, transparent 100%)',
        }}
      >
        <span className="text-sm font-semibold text-ink/50">{labels[phase]}</span>
      </div>
      <p className="mt-2 text-[11px] text-ink/25">{t('radio.breathingCycle')}</p>
    </div>
  )
}

/* ── 频道图标（白噪音四频道：雨声/微风/咖啡馆/壁炉）── */

function ChannelIcon({ id }: { id: string }) {
  const p = {
    width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (id) {
    case 'rain':
      return (
        <svg {...p}>
          <path d="M7 15.5a4 4 0 01-.5-7.97A5 5 0 0116.5 6.5 3.5 3.5 0 0117 15.5H7z" />
          <line x1="8.5" y1="18" x2="7.5" y2="20.5" />
          <line x1="12" y1="18" x2="11" y2="21" />
          <line x1="15.5" y1="18" x2="14.5" y2="20.5" />
        </svg>
      )
    case 'wind':
      return (
        <svg {...p}>
          <path d="M3 8.5h9a2.5 2.5 0 10-2.5-2.5" />
          <path d="M3 12.5h13a2.5 2.5 0 11-2.5 2.5" />
          <path d="M3 16.5h7a2 2 0 11-2 2" />
        </svg>
      )
    case 'cafe':
      return (
        <svg {...p}>
          <path d="M4 9h12v3.5a5 5 0 01-5 5H9a5 5 0 01-5-5V9z" />
          <path d="M16 10h1.5a2.5 2.5 0 010 5H16" />
          <line x1="7.5" y1="3.5" x2="7.5" y2="5.5" />
          <line x1="11" y1="3.5" x2="11" y2="5.5" />
        </svg>
      )
    case 'fireplace':
      return (
        <svg {...p}>
          <path d="M12 3.5c1.2 2.8-1.8 4-1.8 6.8a3.8 3.8 0 007.6.2c0-1.2-.5-2.3-1.2-3 .1 1.9-1.4 2.4-1.9 1.4C13 7 12 5.6 12 3.5z" />
        </svg>
      )
    default:
      return null
  }
}

/* ── Main ── */

export function RadioOverlay({ audio, onClose }: RadioOverlayProps) {
  const { t } = useT()
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [breathingActive, setBreathingActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chName = (id: string) => t(`radio.ch.${id}.name`)
  const chDesc = (id: string) => t(`radio.ch.${id}.desc`)
  const timerLabel = (m: number) => (m === 0 ? t('radio.timerNone') : t('radio.minutes', { n: String(m) }))

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (timerMinutes > 0 && audio.isPlaying) {
      timerRef.current = setTimeout(() => audio.stop(), timerMinutes * 60 * 1000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerMinutes, audio.isPlaying, audio.stop])

  const activeChannel = CHANNELS.find(c => c.id === audio.currentChannel)!

  return (
    <GameOverlay title={t('radio.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[5dvh] overflow-y-auto">

        <div className="mx-auto w-full max-w-[130px]">
          <AssetImage
            src={toolAssets.radio.src}
            fallbackSrc={toolAssets.radio.fallbackSrc}
            alt={t('radio.title')}
            variant="item"
            className="h-auto w-full drop-shadow-[0_6px_18px_rgba(138,97,74,0.15)]"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-ink">{chName(activeChannel.id)}</p>
          <p className="mt-1 text-sm text-ink/40">{chDesc(activeChannel.id)}</p>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          {CHANNELS.map((ch) => {
            const isActive = audio.currentChannel === ch.id && audio.isPlaying
            return (
              <button
                key={ch.id}
                type="button"
                className="flex flex-col items-center gap-1.5 transition-all"
                onClick={() => audio.play(ch.id)}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    background: isActive ? ch.color : 'rgba(255,255,255,0.35)',
                    color: isActive ? '#fff' : 'rgba(78,64,55,0.45)',
                    boxShadow: isActive ? `0 4px 20px ${ch.color}35` : 'none',
                  }}
                >
                  <ChannelIcon id={ch.id} />
                </span>
                <span className={`text-[11px] transition-all ${isActive ? 'text-ink font-semibold' : 'text-ink/35'}`}>
                  {chName(ch.id)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/40 text-ink/55 transition-all hover:bg-white/50 active:scale-95"
            onClick={() => {
              if (audio.isPlaying) audio.stop()
              else audio.play(audio.currentChannel)
            }}
          >
            {audio.isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <rect x="5" y="3" width="4" height="16" rx="1.5"></rect>
                <rect x="13" y="3" width="4" height="16" rx="1.5"></rect>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                <path d="M6 3.5v15a1 1 0 001.5.87l12-7.5a1 1 0 000-1.74l-12-7.5A1 1 0 006 3.5z"></path>
              </svg>
            )}
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 px-3">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-ink/25">
            <path d="M8 2L4 5.5H1v5h3L8 14V2z"></path>
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audio.volume}
            onChange={(e) => audio.updateVolume(parseFloat(e.target.value))}
            className="h-1 w-full appearance-none rounded-full bg-white/30"
            style={{ accentColor: '#8a614a' }}
          />
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-ink/25">
            <path d="M8 2L4 5.5H1v5h3L8 14V2z"></path>
            <path d="M11 5.5a3.5 3.5 0 010 5" stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round"></path>
            <path d="M13 3.5a6.5 6.5 0 010 9" stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round"></path>
          </svg>
        </div>

        <div className="mt-6">
          <p className="text-xs text-ink/30">{t('radio.timerLabel')}</p>
          <div className="mt-2 flex gap-2">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.minutes}
                type="button"
                className={`rounded-full px-3.5 py-1.5 text-xs transition ${
                  timerMinutes === opt.minutes
                    ? 'bg-butter/70 text-ink font-semibold'
                    : 'bg-white/25 text-ink/40'
                }`}
                onClick={() => setTimerMinutes(opt.minutes)}
              >
                {timerLabel(opt.minutes)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-[16px] bg-white/20 px-4 py-3 transition hover:bg-white/28"
            onClick={() => setBreathingActive(!breathingActive)}
          >
            <span className="text-sm text-ink/55">{t('radio.breathingTitle')}</span>
            <span className={`text-xs ${breathingActive ? 'text-[#5a8a52] font-semibold' : 'text-ink/25'}`}>
              {breathingActive ? t('radio.breathingActive') : t('radio.breathingInactive')}
            </span>
          </button>
          <BreathingGuide active={breathingActive} />
        </div>
      </section>
    </GameOverlay>
  )
}
