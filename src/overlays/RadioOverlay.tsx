import { useState, useRef, useEffect, useCallback } from 'react'
import { toolAssets } from '../lib/assets'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'

// ── Channel definitions ──

type ChannelId = 'rain' | 'wind' | 'cafe' | 'fireplace'

interface Channel {
  id: ChannelId
  name: string
  desc: string
  color: string
  noiseType: 'white' | 'pink' | 'brown'
  filterFreq: number
  filterQ: number
}

const CHANNELS: Channel[] = [
  { id: 'rain', name: '雨声', desc: '窗外淅淅沥沥', color: '#7a9eb8', noiseType: 'white', filterFreq: 1200, filterQ: 0.7 },
  { id: 'wind', name: '微风', desc: '树叶沙沙地响', color: '#8aab7a', noiseType: 'brown', filterFreq: 400, filterQ: 0.5 },
  { id: 'cafe', name: '咖啡馆', desc: '远处有人小声说话', color: '#b89a7a', noiseType: 'pink', filterFreq: 800, filterQ: 0.4 },
  { id: 'fireplace', name: '壁炉', desc: '柴火噼啪作响', color: '#c4816b', noiseType: 'brown', filterFreq: 250, filterQ: 1.0 },
]

const TIMER_OPTIONS = [
  { label: '不限', minutes: 0 },
  { label: '15 分钟', minutes: 15 },
  { label: '30 分钟', minutes: 30 },
  { label: '60 分钟', minutes: 60 },
]

// ── Audio engine ──

function createNoiseBuffer(ctx: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBuffer {
  const size = ctx.sampleRate * 2
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  if (type === 'white') {
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
  } else if (type === 'brown') {
    let last = 0
    for (let i = 0; i < size; i++) {
      const w = Math.random() * 2 - 1
      data[i] = (last + 0.02 * w) / 1.02
      last = data[i]
      data[i] *= 3.5
    }
  } else {
    // pink noise (Voss-McCartney)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < size; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.96900 * b2 + w * 0.1538520
      b3 = 0.86650 * b3 + w * 0.3104856
      b4 = 0.55000 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  }
  return buffer
}

function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentChannel, setCurrentChannel] = useState<ChannelId>('rain')
  const [volume, setVolume] = useState(0.5)

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop() } catch { /* already stopped */ }
      sourceRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const play = useCallback((channelId: ChannelId) => {
    // Stop previous
    if (sourceRef.current) {
      try { sourceRef.current.stop() } catch { /* ok */ }
      sourceRef.current = null
    }

    const channel = CHANNELS.find(c => c.id === channelId)!

    if (!ctxRef.current) ctxRef.current = new AudioContext()
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const buffer = createNoiseBuffer(ctx, channel.noiseType)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = channel.filterFreq
    filter.Q.value = channel.filterQ

    const gain = ctx.createGain()
    gain.gain.value = volume
    gainRef.current = gain

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()
    sourceRef.current = source
    setCurrentChannel(channelId)
    setIsPlaying(true)
  }, [stop, volume])

  const updateVolume = useCallback((v: number) => {
    setVolume(v)
    if (gainRef.current) gainRef.current.gain.value = v
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) try { sourceRef.current.stop() } catch { /* ok */ }
      if (ctxRef.current) try { ctxRef.current.close() } catch { /* ok */ }
    }
  }, [])

  return { isPlaying, currentChannel, volume, play, stop, updateVolume }
}

// ── Breathing guide (4s inhale → 4s hold → 6s exhale) ──

function BreathingGuide({ active }: { active: boolean }) {
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

  const labels = { inhale: '吸气', hold: '屏住', exhale: '呼气' }

  return (
    <div className="flex flex-col items-center py-3">
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 96,
          height: 96,
          transform: `scale(${scale})`,
          transition: 'transform 80ms linear',
          background: 'radial-gradient(circle, rgba(207,216,192,0.45) 0%, rgba(207,216,192,0.1) 70%, transparent 100%)',
        }}
      >
        <span className="text-sm font-semibold text-ink/50">{labels[phase]}</span>
      </div>
      <p className="mt-2 text-[11px] text-ink/25">4 秒吸 · 4 秒屏 · 6 秒呼</p>
    </div>
  )
}

// ── Main component ──

interface RadioOverlayProps {
  onClose: () => void
}

export function RadioOverlay({ onClose }: RadioOverlayProps) {
  const audio = useAmbientAudio()
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [breathingActive, setBreathingActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sleep timer
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (timerMinutes > 0 && audio.isPlaying) {
      timerRef.current = setTimeout(() => audio.stop(), timerMinutes * 60 * 1000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timerMinutes, audio.isPlaying, audio.stop])

  const activeChannel = CHANNELS.find(c => c.id === audio.currentChannel)!

  return (
    <GameOverlay title="收音机" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[5dvh] overflow-y-auto">

        {/* Radio image */}
        <div className="mx-auto w-full max-w-[130px]">
          <AssetImage
            src={toolAssets.radio.src}
            fallbackSrc={toolAssets.radio.fallbackSrc}
            alt="收音机"
            variant="item"
            className="h-auto w-full drop-shadow-[0_6px_18px_rgba(138,97,74,0.15)]"
          />
        </div>

        {/* Current station */}
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-ink">{activeChannel.name}</p>
          <p className="mt-1 text-sm text-ink/40">{activeChannel.desc}</p>
        </div>

        {/* Channel selector */}
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
                  className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300"
                  style={{
                    background: isActive ? ch.color : 'rgba(255,255,255,0.35)',
                    color: isActive ? '#fff' : 'rgba(78,64,55,0.45)',
                    boxShadow: isActive ? `0 4px 20px ${ch.color}35` : 'none',
                  }}
                >
                  {ch.name.charAt(0)}
                </span>
                <span className={`text-[11px] transition-all ${isActive ? 'text-ink font-semibold' : 'text-ink/35'}`}>
                  {ch.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* Play / Pause */}
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

        {/* Volume */}
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

        {/* Sleep timer */}
        <div className="mt-6">
          <p className="text-xs text-ink/30">定时关闭</p>
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
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breathing guide */}
        <div className="mt-6">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-[16px] bg-white/20 px-4 py-3 transition hover:bg-white/28"
            onClick={() => setBreathingActive(!breathingActive)}
          >
            <span className="text-sm text-ink/55">呼吸引导</span>
            <span className={`text-xs ${breathingActive ? 'text-[#5a8a52] font-semibold' : 'text-ink/25'}`}>
              {breathingActive ? '进行中' : '点击开启'}
            </span>
          </button>
          <BreathingGuide active={breathingActive} />
        </div>

      </section>
    </GameOverlay>
  )
}
