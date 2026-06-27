/**
 * GuideTour.tsx — 新手店铺导览（聚光灯版）
 *
 * onboarding"开张"后、第一次进铺子前跑一次：
 *  - 套在和首页**完全相同的固定容器**里（手机列 max-w-[430px] + overflow-hidden + 1024:1536 等比舞台），
 *    所以坐标、裁切都和首页一致——超出舞台的物件(留言板/小屋)会被列裁掉，不会溢出到屏幕两边。
 *  - 全屏暗蒙版盖住整个铺子；讲到哪个物件，就在真实模板上按 sceneItems 坐标把它原地照亮。
 *  - 面点精灵浮在下方中间、带对话气泡讲解；**点屏幕任意处 = 知道了，下一个**。
 *  - 结尾把"白天冷清"框成"铺子本来只在清晨热闹"；标题/文案按当前是不是清晨分两套。
 */

import { useState } from 'react'
import { sceneAssets } from '../lib/assets'
import { SpiritSprite } from '../components/SpiritSprite'
import { sceneItems } from '../lib/sceneItems'
import { isMorningOpenTime } from '../lib/timeScene'
import { SoftButton } from '../components/SoftButton'
import { useT } from '../lib/i18n'

interface GuideTourProps {
  spiritName: string
  onGoToEveningPrepare: () => void
  onFinishToHome: () => void
}

type ObjStep = {
  id: string
  name: { zh: string; en: string }
  desc: { zh: string; en: string }
}

const OBJECT_STEPS: ObjStep[] = [
  {
    id: 'spirit',
    name: { zh: '面点精灵', en: 'Your spirit' },
    desc: { zh: '我会一直在铺子里陪你。想聊天，随时点我。', en: 'I’ll always be here in the shop. Tap me anytime to talk.' },
  },
  {
    id: 'recipeBook',
    name: { zh: '菜谱本', en: 'Recipe book' },
    desc: { zh: '记着你会做的早点。早睡、和客人混熟，手艺会越攒越多。', en: 'The dishes you can make. They grow as you sleep well and befriend guests.' },
  },
  {
    id: 'guestBook',
    name: { zh: '客人图鉴', en: 'Guest book' },
    desc: { zh: '来过的客人会一页页攒起来，混熟了还会教你做家乡菜。', en: 'Guests who visit fill it page by page — close ones even teach you their home dishes.' },
  },
  {
    id: 'logbook',
    name: { zh: '营业账本', en: 'Logbook' },
    desc: { zh: '记你几点开门、几点关灯。你最近过得怎么样，都在这本上。', en: 'When you open and close up. How you’ve been lately — it’s all in here.' },
  },
  {
    id: 'messageBoard',
    name: { zh: '留言板', en: 'Message board' },
    desc: { zh: '客人留下的话、铺子的碎语，都贴在这。', en: 'Notes from guests and little murmurs of the shop, pinned here.' },
  },
  {
    id: 'spiritHut',
    name: { zh: '精灵小屋', en: 'My hut' },
    desc: { zh: '我的家，夜里打烊后我回这儿睡。也能在这给我换个点心样子。', en: 'My home — I sleep here after closing. You can also change my pastry look here.' },
  },
]

const TOTAL = OBJECT_STEPS.length + 2 // welcome + objects + finale

const ANIM = `
@keyframes tourBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
@keyframes tourSpot { 0%,100% { filter: drop-shadow(0 0 12px rgba(250,224,156,0.9)) drop-shadow(0 0 22px rgba(250,224,156,0.5)); transform: scale(1) } 50% { filter: drop-shadow(0 0 18px rgba(250,224,156,1)) drop-shadow(0 0 34px rgba(250,224,156,0.7)); transform: scale(1.05) } }
@keyframes tourFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
`

export function GuideTour({ spiritName, onGoToEveningPrepare, onFinishToHome }: GuideTourProps) {
  const { lang } = useT()
  const zh = lang === 'zh'
  const [step, setStep] = useState(0)

  const isWelcome = step === 0
  const isFinale = step === TOTAL - 1
  const obj = !isWelcome && !isFinale ? OBJECT_STEPS[step - 1]! : null
  // 精灵那步不点亮场景里的旧静态精灵——浮在屏幕中间那只就代表它
  const litItem = obj && obj.id !== 'spirit' ? sceneItems.find((s) => s.id === obj.id) : null
  const contextItems = sceneItems.filter((s) => s.id !== 'spirit')

  const morning = isMorningOpenTime()
  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1))

  const bubbleText = isWelcome
    ? (zh ? `我是${spiritName}，铺子里的面点精灵。先带你认认门，几步就好。` : `I’m ${spiritName}, the dough spirit here. Let me show you around — just a few steps.`)
    : obj
      ? obj.desc[lang]
      : ''

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#2a2520]"
      onClick={isFinale ? undefined : next}
    >
      <style>{ANIM}</style>

      {/* 和首页一模一样的固定手机列容器：超出舞台的物件被裁掉，不溢出屏幕两边 */}
      <div className="relative mx-auto h-full w-full max-w-[430px] overflow-hidden">
        {/* 铺子模板（固定高宽比，坐标与首页一致） */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full" style={{ aspectRatio: '1024 / 1536', maxHeight: '100%' }}>
            {/* 背景 */}
            <img
              src={sceneAssets.mainBackground.src}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              onError={(e) => { const f = sceneAssets.mainBackground.fallbackSrc; if (f) (e.target as HTMLImageElement).src = f }}
            />
            {/* 场景物件（铺底，会被蒙版压暗） */}
            {contextItems.map((it) => (
              <img
                key={it.id}
                src={it.src}
                alt=""
                className="absolute h-auto"
                style={{ left: `${it.x}%`, top: `${it.y}%`, width: `${it.width}%`, zIndex: it.zIndex }}
                onError={(e) => { if (it.fallbackSrc) (e.target as HTMLImageElement).src = it.fallbackSrc }}
              />
            ))}
            {/* 暗蒙版 */}
            <div className="absolute inset-0" style={{ zIndex: 20, background: 'rgba(31,27,24,0.76)' }} />
            {/* 当前讲到的物件：原地重绘高亮版，浮在蒙版之上 */}
            {litItem ? (
              <img
                key={`lit-${litItem.id}`}
                src={litItem.src}
                alt={litItem.label}
                className="absolute h-auto"
                style={{ left: `${litItem.x}%`, top: `${litItem.y}%`, width: `${litItem.width}%`, zIndex: 30, animation: 'tourSpot 2s ease-in-out infinite' }}
                onError={(e) => { if (litItem.fallbackSrc) (e.target as HTMLImageElement).src = litItem.fallbackSrc }}
              />
            ) : null}
          </div>
        </div>

        {/* 跳过 */}
        <button
          type="button"
          className="absolute right-4 top-[7dvh] z-[80] rounded-full bg-white/12 px-4 py-1.5 text-xs text-paper/80 backdrop-blur-sm transition hover:bg-white/20"
          onClick={(e) => { e.stopPropagation(); onFinishToHome() }}
        >
          {zh ? '跳过' : 'Skip'}
        </button>

        {!isFinale ? (
          /* ── 精灵 + 对话气泡（浮在下方中间），点屏幕任意处下一个 ── */
          <div className="pointer-events-none absolute inset-x-0 bottom-[10dvh] z-[70] flex flex-col items-center px-6">
            <div
              key={step}
              className="mb-3 max-w-[300px] rounded-[22px] bg-paper/95 px-5 py-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
              style={{ animation: 'tourFade 280ms ease-out' }}
            >
              {obj ? <p className="text-base font-semibold text-ink">{obj.name[lang]}</p> : null}
              <p className={`${obj ? 'mt-1' : ''} text-sm leading-6 text-ink/70`}>{bubbleText}</p>
            </div>
            <SpiritSprite body="base" face="normal" alt={spiritName} className="h-24 drop-shadow-[0_10px_30px_rgba(138,97,74,0.3)]" style={{ animation: 'tourBob 4s ease-in-out infinite' }} />

            {/* 进度点 + 提示 */}
            <div className="mt-3 flex items-center gap-1.5">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-4 bg-[#f0ddb3]' : 'w-1.5 bg-paper/30'}`} />
              ))}
            </div>
            <p className="mt-2 text-xs text-paper/55">{zh ? '点屏幕任意处继续' : 'Tap anywhere to continue'}</p>
          </div>
        ) : (
          /* ── 结尾：按是否清晨分两套文案 ── */
          <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center px-7 text-center" onClick={(e) => e.stopPropagation()}>
            <SpiritSprite body="base" face="normal" alt={spiritName} className="h-28 drop-shadow-[0_10px_30px_rgba(138,97,74,0.3)]" style={{ animation: 'tourBob 4s ease-in-out infinite' }} />
            <h1 className="mt-5 text-xl font-semibold text-paper">
              {morning
                ? (zh ? '这会儿铺子正热闹' : 'The shop is bustling right now')
                : (zh ? '现在铺子安安静静的，别急' : 'The shop is quiet right now — that’s okay')}
            </h1>
            <p className="mt-3 max-w-[320px] text-sm leading-7 text-paper/70">
              {morning
                ? (zh
                    ? '清晨正是铺子最热闹的时候，客人都来了。先去定个今晚几点关灯，回头就能开门招呼。'
                    : 'Dawn is when the shop is liveliest — the guests are here. Set tonight’s lights-off first, then open up to greet them.')
                : (zh
                    ? '铺子只在清晨真正热闹。白天我们慢慢备菜，傍晚定个今晚几点关灯——你早点歇，明早就能开门，客人就来。'
                    : 'The shop only truly bustles at dawn. We prep through the day; in the evening, set tonight’s lights-off — rest early and it opens to guests tomorrow morning.')}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#f0ddb3]/80">
              {morning
                ? (zh ? '阿橘正等着吃油条呢。' : 'Ginger is waiting for its youtiao.')
                : (zh ? '阿橘说了，明早要来吃油条呢。' : 'Ginger said it’s coming for youtiao tomorrow morning.')}
            </p>

            <div className="mt-7 flex w-full max-w-[300px] flex-col gap-2">
              <SoftButton type="button" variant="primary" block onClick={onGoToEveningPrepare}>
                {zh ? '去定今晚几点关灯' : 'Set tonight’s lights-off'}
              </SoftButton>
              <button
                type="button"
                className="py-2 text-sm text-paper/55 transition hover:text-paper/80"
                onClick={onFinishToHome}
              >
                {zh ? '先自己逛逛' : 'Look around first'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
