/**
 * EveningPrepare.tsx — v6.4
 * Added i18n via useT()
 */

import { useState } from 'react'
import type { EveningPrepareState } from '../lib/storage'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'
import { useT } from '../lib/i18n'

interface EveningPrepareProps {
  initialValue: EveningPrepareState
  spiritName: string
  onSave: (value: EveningPrepareState) => void
  onGoToSpiritChat: () => void
  onClose: () => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

export function EveningPrepare({ initialValue, spiritName, onSave, onGoToSpiritChat, onClose }: EveningPrepareProps) {
  const [plannedLightsOffTime, setPlannedLightsOffTime] = useState(initialValue.plannedLightsOffTime)
  const [worry, setWorry] = useState(initialValue.worry)
  const [saved, setSaved] = useState(false)
  const { t } = useT()

  return (
    <GameOverlay title={t('evening.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[11dvh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-ink">{t('evening.title')}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">{t('evening.spiritAsk', { name: spiritName })}</p>
        </div>

        <div className="mt-6">
          <p className="text-xs text-ink/40">{t('evening.lightsOffLabel')}</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {timeOptions.map((option) => (
              <button key={option} type="button"
                className={`rounded-full py-3 text-base font-semibold transition ${plannedLightsOffTime === option ? 'bg-butter/70 text-ink' : 'bg-white/35 text-ink/55'}`}
                onClick={() => setPlannedLightsOffTime(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <p className="text-xs text-ink/40">{t('evening.worryLabel')}</p>
          <textarea value={worry} onChange={(e) => setWorry(e.target.value)}
            className="mt-3 min-h-[100px] flex-1 resize-none rounded-[20px] bg-white/30 px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/25 focus:bg-white/45"
            placeholder={t('evening.worryPlaceholder')} />
          <p className="mt-3 text-sm leading-6 text-ink/50">{t('evening.spiritReply', { name: spiritName })}</p>
        </div>

        <div className="mt-4">
          <SoftButton type="button" variant="primary" block
            onClick={() => { onSave({ plannedLightsOffTime, worry, savedAt: new Date().toISOString() }); setSaved(true) }}>
            {saved ? t('common.saved') : t('evening.saveBtn')}
          </SoftButton>
          {saved ? (
            <div className="mt-3 text-center">
              <p className="text-sm text-brown/70">{t('evening.savedMsg')}</p>
              <button type="button" className="mt-2 text-sm text-brown/50 transition hover:text-brown/70" onClick={onGoToSpiritChat}>
                {t('evening.backToChat', { name: spiritName })}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </GameOverlay>
  )
}
