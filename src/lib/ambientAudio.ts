/**
 * ambientAudio.ts — v6.1
 *
 * App-level audio engine hook.
 * Extracted from RadioOverlay so audio persists when overlay closes.
 * Call useAmbientAudio() once in App.tsx, pass controls down to RadioOverlay + Home mini player.
 */

import { useState, useRef, useEffect, useCallback } from 'react'

export type ChannelId = 'rain' | 'wind' | 'cafe' | 'fireplace'

export interface Channel {
  id: ChannelId
  name: string
  desc: string
  color: string
  noiseType: 'white' | 'pink' | 'brown'
  filterFreq: number
  filterQ: number
}

export const CHANNELS: Channel[] = [
  { id: 'rain', name: '雨声', desc: '窗外淅淅沥沥', color: '#7a9eb8', noiseType: 'white', filterFreq: 1200, filterQ: 0.7 },
  { id: 'wind', name: '微风', desc: '树叶沙沙地响', color: '#8aab7a', noiseType: 'brown', filterFreq: 400, filterQ: 0.5 },
  { id: 'cafe', name: '咖啡馆', desc: '远处有人小声说话', color: '#b89a7a', noiseType: 'pink', filterFreq: 800, filterQ: 0.4 },
  { id: 'fireplace', name: '壁炉', desc: '柴火噼啪作响', color: '#c4816b', noiseType: 'brown', filterFreq: 250, filterQ: 1.0 },
]

export const TIMER_OPTIONS = [
  { label: '不限', minutes: 0 },
  { label: '15 分钟', minutes: 15 },
  { label: '30 分钟', minutes: 30 },
  { label: '60 分钟', minutes: 60 },
]

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

export interface AmbientAudioControls {
  isPlaying: boolean
  currentChannel: ChannelId
  volume: number
  play: (channelId: ChannelId) => void
  stop: () => void
  updateVolume: (v: number) => void
}

export function useAmbientAudio(): AmbientAudioControls {
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
  }, [volume])

  const updateVolume = useCallback((v: number) => {
    setVolume(v)
    if (gainRef.current) gainRef.current.gain.value = v
  }, [])

  useEffect(() => {
    return () => {
      if (sourceRef.current) try { sourceRef.current.stop() } catch { /* ok */ }
      if (ctxRef.current) try { ctxRef.current.close() } catch { /* ok */ }
    }
  }, [])

  return { isPlaying, currentChannel, volume, play, stop, updateVolume }
}
