/**
 * GuestBookOpenView.tsx — v6.6
 *
 * "小故事" → "来往" (Bond)
 * - Familiarity badge next to name
 * - Encounters unlock by familiarityLevel (0-3)
 * - Only shows unlocked beats, grows naturally like a diary
 * - i18n via useT()
 */

import { useEffect, useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { bookAssets, sceneAssets } from '../lib/assets'
import { guests } from '../lib/demoData'
import {
  getFamiliarityLabel,
  type GuestProgressMap,
  type FamiliarityLevel,
} from '../lib/guestProgression'
import { guestEncounters } from '../lib/guestEncounters'
import { useT } from '../lib/i18n'

interface GuestBookOpenViewProps {
  page: number
  guestProgress: GuestProgressMap
  onBackToHome: () => void
  onPrev: () => void
  onNext: () => void
}

function preloadImage(src?: string) {
  return new Promise<void>((resolve) => {
    if (!src) { resolve(); return }
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })
}

/** 熟络标签样式 */
const familiarityStyles: Record<FamiliarityLevel, { bg: string; text: string }> = {
  0: { bg: 'bg-ink/8', text: 'text-ink/40' },
  1: { bg: 'bg-[#d4a574]/20', text: 'text-[#a07050]' },
  2: { bg: 'bg-[#a07050]/25', text: 'text-[#7a5535]' },
  3: { bg: 'bg-[#f0ddb3]/50', text: 'text-[#8a614a]' },
}

export function GuestBookOpenView({
  page, guestProgress, onBackToHome, onPrev, onNext,
}: GuestBookOpenViewProps) {
  const [displayPage, setDisplayPage] = useState(page)
  const [isVisible, setIsVisible] = useState(false)
  const { t, lang } = useT()
  const guest = guests[displayPage]

  const progress = guestProgress[guest.key]
  const met = !!progress
  const realVisitCount = progress?.totalVisits ?? 0
  const familiarityLevel: FamiliarityLevel = progress?.familiarityLevel ?? 0
  const familiarityLabel = getFamiliarityLabel(familiarityLevel)

  // 未见过的客人不展示任何"来往"叙事；见过才按熟络度逐拍解锁
  const encounters = guestEncounters[guest.key] ?? []
  const unlockedBeats = met ? encounters.slice(0, familiarityLevel + 1) : []

  useEffect(() => {
    let active = true
    setIsVisible(false)
    void Promise.all([
      preloadImage(bookAssets.guestBookInner.src),
      preloadImage(bookAssets.guestBookInner.fallbackSrc),
      preloadImage(guests[page]?.image.src),
      preloadImage(guests[page]?.image.fallbackSrc),
    ]).then(() => {
      if (!active) return
      setDisplayPage(page)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { if (active) setIsVisible(true) })
      })
    })
    return () => { active = false }
  }, [page])

  const leftPageNum = displayPage * 2 + 1
  const rightPageNum = displayPage * 2 + 2
  const badgeStyle = familiarityStyles[familiarityLevel]
  const familiarityLabelI18n = lang === 'en'
    ? ['Stranger', 'Acquaintance', 'Regular', 'Old friend'][familiarityLevel]
    : familiarityLabel

  return (
    <section className="absolute inset-0 z-30 h-full overflow-hidden">
      <div className="absolute inset-0 bg-[#d7d3cf]">
        <AssetImage src={sceneAssets.mainBackground.src} fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
          alt="" variant="scene" renderFallbackCard={false} className="h-full w-full object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-[rgba(72,68,67,0.4)]" />

      <button type="button"
        className="font-tianrandai absolute left-4 top-4 z-20 rounded-full bg-ink/20 px-4 py-2 text-base text-paper backdrop-blur-sm transition hover:bg-ink/30"
        onClick={onBackToHome}>
        {t('common.backToShop')}
      </button>

      <div className="absolute inset-x-0 top-[10%] z-10 px-2">
        <div className={`relative mx-auto aspect-square w-[94%] max-w-[430px] transition-all duration-[220ms] ease-out ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.94] opacity-0'
        }`}>
          <AssetImage src={bookAssets.guestBookInner.src} fallbackSrc={bookAssets.guestBookInner.fallbackSrc}
            alt="" variant="book" renderFallbackCard={false}
            className="h-full w-full object-contain drop-shadow-[0_20px_26px_rgba(54,38,26,0.22)]" />

          {/* === 左页 === */}

          {/* 角色图 */}
          <div className="absolute overflow-hidden" style={{ left: '24%', top: '28%', width: '15%', height: '14%' }}>
            <img src={guest.image.src} alt={met ? guest.name : ''} className="h-full w-full object-contain"
              style={met ? undefined : { filter: 'brightness(0) saturate(0)', opacity: 0.22 }}
              onError={(e) => { if (guest.image.fallbackSrc) (e.target as HTMLImageElement).src = guest.image.fallbackSrc }} />
          </div>

          {/* 名字 + 熟络标签 */}
          <div className="font-tianrandai absolute flex flex-col items-center justify-center gap-[2px]"
            style={{ left: '15%', top: '44%', width: '32%', height: '8%' }}>
            <span className="text-center font-semibold leading-tight text-ink" style={{ fontSize: '9.5px' }}>
              {met ? guest.name : (lang === 'en' ? '? ? ?' : '？？？')}
            </span>
            {met ? (
              <span className={`rounded-full px-2 py-[1px] text-center font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
                style={{ fontSize: '7px' }}>
                {familiarityLabelI18n}
              </span>
            ) : null}
          </div>

          {/* 简介 */}
          <div className="font-tianrandai absolute overflow-hidden text-center leading-[1.45] text-ink/72"
            style={{ left: '17%', top: '54%', width: '28%', height: '13%', fontSize: '12.5px' }}>
            {met ? guest.description : (lang === 'en' ? 'Hasn’t visited your shop yet.' : '还没来过你的铺子。')}
          </div>

          {/* === 右页 === */}

          {/* 信息块 */}
          <div className="font-tianrandai absolute overflow-hidden leading-[1.6] text-ink/84"
            style={{ left: '54%', top: '29%', width: '31%', height: '18%', fontSize: '10.5px' }}>
            {met ? (
              <>
                <p><span className="text-ink/55">{lang === 'en' ? 'Likes: ' : '喜欢：'}</span>{guest.favoriteFood}</p>
                <p><span className="text-ink/55">{lang === 'en' ? 'Visits: ' : '来访：'}</span>{realVisitCount}{lang === 'zh' ? ' 次' : ''}</p>
              </>
            ) : (
              <p className="text-ink/40">{lang === 'en' ? 'Not acquainted yet.' : '还不认识。'}</p>
            )}
          </div>

          {/* 来往标题 */}
          <div className="font-tianrandai absolute font-semibold text-ink/55"
            style={{ left: '54%', top: '48%', width: '30%', height: '4%', fontSize: '11px' }}>
            {lang === 'en' ? 'Bond' : '来往'}
          </div>

          {/* 来往内容 — 已解锁的拍 */}
          <div className="font-tianrandai absolute overflow-y-auto leading-[1.5] text-ink/75"
            style={{ left: '54%', top: '53%', width: '31%', height: '16%', fontSize: '9.5px' }}>
            {met ? (
              unlockedBeats.map((beat, i) => (
                <p key={i} className={i > 0 ? 'mt-[4px]' : ''}>
                  {lang === 'en' ? beat.en : beat.zh}
                </p>
              ))
            ) : (
              <p className="text-ink/40">{lang === 'en' ? 'No story yet — wait for it to drop by.' : '还没有来往，等它哪天推门进来。'}</p>
            )}
          </div>

          {/* 页码 */}
          <div className="font-tianrandai absolute flex items-center justify-center text-brown/70"
            style={{ left: '28%', top: '70%', width: '5%', height: '3%', fontSize: '10px' }}>
            {leftPageNum}
          </div>
          <div className="font-tianrandai absolute flex items-center justify-center text-brown/70"
            style={{ left: '67%', top: '71%', width: '5%', height: '3%', fontSize: '10px' }}>
            {rightPageNum}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-20 flex items-end justify-between px-5">
        <button type="button"
          className="font-tianrandai min-w-[104px] rounded-full bg-ink/20 px-5 py-2.5 text-lg text-paper backdrop-blur-sm transition hover:bg-ink/30"
          onClick={onPrev}>
          {t('common.prevGuest')}
        </button>
        <button type="button"
          className="font-tianrandai min-w-[104px] rounded-full bg-ink/20 px-5 py-2.5 text-lg text-paper backdrop-blur-sm transition hover:bg-ink/30"
          onClick={onNext}>
          {t('common.nextGuest')}
        </button>
      </div>
    </section>
  )
}
