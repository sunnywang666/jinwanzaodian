import { useState } from 'react'
import { getSpiritAsset } from '../lib/assets'
import { nightTypeOptions } from '../lib/demoData'
import type { OnboardingProfile } from '../lib/storage'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface OnboardingProps {
  onComplete: (profile: OnboardingProfile) => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

export function Onboarding({ onComplete }: OnboardingProps) {
  const [nightType, setNightType] = useState<OnboardingProfile['nightType']>('说不清')
  const [spiritAppearance, setSpiritAppearance] = useState<OnboardingProfile['spiritAppearance']>('base')
  const [spiritName, setSpiritName] = useState('阿团')
  const [defaultLightsOffTime, setDefaultLightsOffTime] = useState('23:00')

  const canEnter = spiritName.trim().length > 0

  return (
    <div className="mx-auto min-h-screen max-w-[430px] px-3 py-4">
      <div className="paper-panel overflow-hidden">
        <div className="border-b border-line bg-[linear-gradient(180deg,rgba(240,221,179,0.45),rgba(255,249,241,0.7))] px-5 py-6">
          <p className="paper-label">开店前</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">欢迎来到你的早点铺</h1>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            铺子不会催你，也不会评判你。先选一个最像你的夜晚，再把面点精灵领回小屋。
          </p>
        </div>

        <div className="space-y-6 px-5 py-5">
          <section className="space-y-3">
            <h2 className="ink-title">1. 选择最懂你的夜晚类型</h2>
            <div className="flex flex-wrap gap-2">
              {nightTypeOptions.map((option) => (
                <SoftButton
                  key={option}
                  type="button"
                  active={nightType === option}
                  onClick={() => setNightType(option)}
                >
                  {option}
                </SoftButton>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="ink-title">2. 选择精灵外表</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'base' as const, label: '白面团', note: '软乎乎的初始形态' },
                { key: 'xiaolongbao' as const, label: '小笼包', note: '带一点包褶的点心外表' },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`paper-panel overflow-hidden text-left transition ${
                    spiritAppearance === option.key ? 'ring-2 ring-brown/30' : ''
                  }`}
                  onClick={() => setSpiritAppearance(option.key)}
                >
                  <AssetImage
                    src={getSpiritAsset(option.key)}
                    alt={option.label}
                    className="h-36 w-full bg-cream object-contain p-3"
                  />
                  <div className="border-t border-line px-3 py-3">
                    <p className="text-sm font-semibold text-ink">{option.label}</p>
                    <p className="mt-1 text-xs text-ink/70">{option.note}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="ink-title">3. 给精灵起名</h2>
            <label className="paper-panel block px-4 py-3">
              <span className="text-sm text-ink/70">名字</span>
              <input
                value={spiritName}
                onChange={(event) => setSpiritName(event.target.value)}
                className="mt-2 w-full border-0 bg-transparent p-0 text-base text-ink outline-none"
                placeholder="给它起个名字"
              />
            </label>
          </section>

          <section className="space-y-3">
            <h2 className="ink-title">4. 设定默认关灯时间</h2>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((option) => (
                <SoftButton
                  key={option}
                  type="button"
                  active={defaultLightsOffTime === option}
                  onClick={() => setDefaultLightsOffTime(option)}
                >
                  {option}
                </SoftButton>
              ))}
            </div>
          </section>

          <div className="paper-dashed p-4">
            <p className="text-sm text-ink/80">
              你的精灵会先记住一种夜晚，再慢慢陪你把铺子过成自己的节奏。它不是拟人角色，只是一小团面点形态的伙伴。
            </p>
          </div>

          <SoftButton
            type="button"
            variant="primary"
            block
            disabled={!canEnter}
            onClick={() =>
              onComplete({
                nightType,
                spiritAppearance,
                spiritName: spiritName.trim(),
                defaultLightsOffTime,
              })
            }
          >
            进入铺子
          </SoftButton>
        </div>
      </div>
    </div>
  )
}
