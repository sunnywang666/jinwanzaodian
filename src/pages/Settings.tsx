/**
 * Settings.tsx — v5.4
 *
 * Settings page: modify lights-off time, about, reset data.
 */

import { useState } from 'react'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'

interface SettingsProps {
  spiritName: string
  defaultLightsOffTime: string
  onUpdateLightsOffTime: (time: string) => void
  onResetAll: () => void
  onClose: () => void
}

const TIME_OPTIONS = [
  '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30',
]

export function Settings({
  spiritName,
  defaultLightsOffTime,
  onUpdateLightsOffTime,
  onResetAll,
  onClose,
}: SettingsProps) {
  const [selectedTime, setSelectedTime] = useState(defaultLightsOffTime)
  const [timeSaved, setTimeSaved] = useState(false)

  return (
    <GameOverlay title="设置" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[11dvh]">

        {/* Default lights-off time */}
        <div>
          <h3 className="text-base font-semibold text-ink">默认关灯时间</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            每天傍晚准备时会用这个时间作为默认值。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTime === time
                    ? 'bg-butter/70 text-ink'
                    : 'bg-white/35 text-ink/55'
                }`}
                onClick={() => {
                  setSelectedTime(time)
                  setTimeSaved(false)
                }}
              >
                {time}
              </button>
            ))}
          </div>
          {selectedTime !== defaultLightsOffTime ? (
            <SoftButton
              className="mt-3"
              type="button"
              variant="primary"
              onClick={() => {
                onUpdateLightsOffTime(selectedTime)
                setTimeSaved(true)
              }}
            >
              {timeSaved ? '已保存' : '保存'}
            </SoftButton>
          ) : null}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-ink/8" />

        {/* About */}
        <div>
          <h3 className="text-base font-semibold text-ink">关于</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-ink/60">
            <p>「今晚早点」v5.4</p>
            <p>一家只在你手机里的早点铺。</p>
            <p>不是闹钟，不是打卡，不是助眠白噪音。</p>
            <p>铺子不会催你睡觉，只是会在你放下手机的时候，安静地陪着你。</p>
            <p className="mt-4 text-ink/35">
              {spiritName} 也想说：谢谢你来看铺子。
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-ink/8" />

        {/* Data & Privacy */}
        <div>
          <h3 className="text-base font-semibold text-ink">数据与隐私</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            所有数据都保存在你的手机本地，铺子不会上传任何信息。
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-ink/8" />

        {/* Reset */}
        <div>
          <h3 className="text-base font-semibold text-ink text-red-800/70">重置铺子</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            清空所有数据，回到开店之前。这个操作无法撤回。
          </p>
          <SoftButton
            className="mt-3"
            type="button"
            variant="secondary"
            onClick={() => {
              if (window.confirm('确定要清空所有数据吗？铺子会回到最初的样子，所有记录都会消失。')) {
                onResetAll()
              }
            }}
          >
            清空所有数据
          </SoftButton>
        </div>

      </section>
    </GameOverlay>
  )
}
