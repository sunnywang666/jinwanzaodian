/**
 * SpiritHutOverlay.tsx — v6.35
 *
 * 精灵小屋重做：两个 tab
 *  - 换装/陈列：成长线上的所有形态，已解锁可切换、未解锁显示剪影 + "再早睡 X 晚"
 *  - 成就：从已有数据算出的温柔里程碑，已点亮高亮、未点亮显示进度
 *
 * 守产品口吻：皮肤靠累计熄屏早睡解锁（长而稀有），成就是回看而非 KPI。
 */

import { useState } from 'react'
import type { LogEntry, SpiritForm } from '../lib/storage'
import { SpiritSprite } from '../components/SpiritSprite'
import { GameOverlay } from '../components/GameOverlay'
import {
  isFormUnlocked,
  getSkinGoodNightsRequired,
  isSkinComingSoon,
  SKIN_ORDER,
  type SpiritProgressState,
} from '../lib/spiritProgression'
import {
  computeAchievements,
  achievementProgress,
  sleepRecords,
  type Achievement,
} from '../lib/achievements'
import type { GuestProgressMap } from '../lib/guestProgression'
import type { DishProgressMap } from '../lib/dishProgression'
import { guestReferences } from '../lib/guestReferences'
import { dishes } from '../lib/demoData'
import { useT } from '../lib/i18n'

// 成就分组（展示用）
const ACH_GROUPS: Array<{ titleKey: string; keys: string[] }> = [
  { titleKey: 'spiritHut.achGroupSleep', keys: ['firstNight', 'weekEarly', 'monthEarly', 'hundredNights'] },
  { titleKey: 'spiritHut.achGroupCollect', keys: ['firstGuest', 'allGuests', 'firstDish', 'fullMenu', 'collector'] },
  { titleKey: 'spiritHut.achGroupRest', keys: ['soundSleep', 'earlyDown'] },
]

interface SpiritHutOverlayProps {
  spiritName: string
  currentForm: SpiritForm
  spiritProgress: SpiritProgressState
  guestProgress: GuestProgressMap
  dishProgress: DishProgressMap
  logEntries: LogEntry[]
  onSelectForm: (form: SpiritForm) => void
  onClose: () => void
}

export function SpiritHutOverlay({
  spiritName,
  currentForm,
  spiritProgress,
  guestProgress,
  dishProgress,
  logEntries,
  onSelectForm,
  onClose,
}: SpiritHutOverlayProps) {
  const { t } = useT()
  const [tab, setTab] = useState<'skins' | 'achievements'>('skins')

  const skinsUnlocked = SKIN_ORDER.filter((f) => isFormUnlocked(spiritProgress, f)).length
  const records = sleepRecords(logEntries)
  const achievements = computeAchievements({
    goodNights: spiritProgress.totalGoodNights,
    skinsUnlocked,
    totalSkins: SKIN_ORDER.length,
    guestsMet: Object.values(guestProgress).filter((g) => g.totalVisits > 0).length,
    totalGuests: guestReferences.length,
    dishesMade: Object.values(dishProgress).filter((d) => d.unlocked).length,
    totalDishes: dishes.length,
    longestRestMinutes: records.longestRestMinutes,
    earliestPutDownScale: records.earliestPutDownScale,
  })
  const achProgress = achievementProgress(achievements)

  return (
    <GameOverlay title={t('spiritHut.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-4 pb-5 pt-[11dvh]">
        {/* 头部：当前形态大图 + 名字 + 累计 */}
        <div className="flex flex-col items-center px-4 pb-4 text-center">
          <div className="flex h-32 items-center justify-center">
            <SpiritSprite body={currentForm} face="normal" className="h-28 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]" alt={spiritName} />
          </div>
          <h1 className="mt-3 text-xl font-semibold text-ink">{spiritName}</h1>
          {SKIN_ORDER.includes(currentForm) ? (
            <p className="mt-0.5 text-xs text-ink/50">{t(`spiritHut.skins.${currentForm}`)}</p>
          ) : null}
          <p className="mt-1 text-xs text-ink/40">{t('spiritHut.goodNights', { count: String(spiritProgress.totalGoodNights) })}</p>
        </div>

        {/* Tab 切换 */}
        <div className="mb-3 flex gap-2">
          <button type="button"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === 'skins' ? 'bg-butter/70 text-ink' : 'bg-white/30 text-ink/40'}`}
            onClick={() => setTab('skins')}>
            {t('spiritHut.tabSkins')}
          </button>
          <button type="button"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === 'achievements' ? 'bg-butter/70 text-ink' : 'bg-white/30 text-ink/40'}`}
            onClick={() => setTab('achievements')}>
            {t('spiritHut.tabAchievements')} · {achProgress.unlocked}/{achProgress.total}
          </button>
        </div>

        {tab === 'skins' ? (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <p className="mb-2 px-1 text-xs font-medium text-ink/45">{t('spiritHut.skinSectionTitle')}</p>
            <div className="grid grid-cols-3 gap-3 rounded-[18px] bg-[#e7d3b3]/25 p-3">
              {SKIN_ORDER.map((form) => {
                const unlocked = isFormUnlocked(spiritProgress, form)
                const isActive = currentForm === form
                const need = getSkinGoodNightsRequired(form)
                const remaining = Math.max(0, need - spiritProgress.totalGoodNights)
                return (
                  <button key={form} type="button" disabled={!unlocked}
                    className={`relative flex flex-col items-center rounded-[16px] px-2 py-3 shadow-[0_3px_0_rgba(184,138,92,0.25)] transition-all duration-200 ${
                      isActive ? 'bg-butter/45 ring-2 ring-[#d4a574]/50' : unlocked ? 'bg-paper/70 hover:bg-paper/85' : 'bg-paper/35'
                    }`}
                    onClick={() => { if (unlocked) onSelectForm(form) }}>
                    <div className="relative flex h-14 items-center justify-center">
                      {unlocked ? (
                        <SpiritSprite body={form} face="normal" className="h-14" alt={t(`spiritHut.skins.${form}`)} />
                      ) : (
                        // 未解锁：剪影（不加载真图，纯色块占位）
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/15">
                          <span className="text-lg text-ink/30">🔒</span>
                        </div>
                      )}
                    </div>
                    <p className={`mt-1.5 text-xs font-semibold ${isActive ? 'text-ink' : unlocked ? 'text-ink/65' : 'text-ink/35'}`}>
                      {unlocked ? t(`spiritHut.skins.${form}`) : '？？？'}
                    </p>
                    {!unlocked ? (
                      <p className="mt-0.5 text-[10px] leading-tight text-ink/35">
                        {isSkinComingSoon(form)
                          ? t('spiritHut.lockedSoon', { count: String(need) })
                          : t('spiritHut.lockedHint', { count: String(remaining) })}
                      </p>
                    ) : null}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 px-1 text-[10px] leading-5 text-ink/30">{t('spiritHut.skinNote')}</p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
            {/* 总进度 */}
            <div className="rounded-[16px] bg-white/25 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink/50">{t('spiritHut.achOverall')}</span>
                <span className="text-xs text-ink/45">{achProgress.unlocked} / {achProgress.total}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink/8">
                <div className="h-full rounded-full bg-[#5a8a52]/45"
                  style={{ width: `${achProgress.total > 0 ? Math.round((achProgress.unlocked / achProgress.total) * 100) : 0}%` }} />
              </div>
            </div>
            {/* 分组 */}
            {ACH_GROUPS.map((group) => {
              const items = achievements.filter((a) => group.keys.includes(a.key))
              if (items.length === 0) return null
              return (
                <div key={group.titleKey} className="space-y-2.5">
                  <p className="px-1 text-xs font-medium text-ink/45">{t(group.titleKey)}</p>
                  {items.map((a) => <AchievementCard key={a.key} a={a} t={t} />)}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </GameOverlay>
  )
}

function AchievementCard({ a, t }: { a: Achievement; t: (key: string, vars?: Record<string, string>) => string }) {
  const pct = a.goal > 0 ? Math.min(100, Math.round((Math.min(a.current, a.goal) / a.goal) * 100)) : 0
  return (
    <div className={`rounded-[16px] px-4 py-3 transition ${a.unlocked ? 'bg-butter/35' : 'bg-white/25'}`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-semibold ${a.unlocked ? 'text-ink' : 'text-ink/55'}`}>
          {t(`achievements.${a.key}.title`)}
        </p>
        {a.unlocked ? (
          <span className="shrink-0 rounded-full bg-[#5a8a52]/15 px-2 py-0.5 text-[10px] font-medium text-[#5a8a52]">{t('spiritHut.achUnlocked')}</span>
        ) : !a.boolean ? (
          <span className="shrink-0 text-[10px] text-ink/35">{Math.min(a.current, a.goal)} / {a.goal}</span>
        ) : null}
      </div>
      <p className={`mt-1 text-xs leading-5 ${a.unlocked ? 'text-ink/55' : 'text-ink/40'}`}>
        {t(`achievements.${a.key}.desc`)}
      </p>
      {!a.unlocked && !a.boolean ? (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
          <div className="h-full rounded-full bg-[#d4a574]/55" style={{ width: `${pct}%` }} />
        </div>
      ) : null}
    </div>
  )
}
