/**
 * GuideTour.tsx — 新手店铺导览
 *
 * 在 onboarding"开张"之后、第一次进铺子前跑一次：
 *  1. 精灵带店长认识铺子里的关键物件（菜谱本/客人本/账本/黑板/小屋）。
 *  2. 收尾解决"下午冷启动空铺子"的留人问题——把白天的安静重新框成
 *     "铺子本来只在清晨热闹"，并给一个此刻就能做的动作（定今晚关灯时间 = 预承诺）
 *     + 一个明早再来的理由（阿橘说要来吃油条）。
 *
 * 不依赖坐标点位：用"精灵旁白 + 物件缩略图 + 位置提示"的方式讲解，
 * 在任何屏幕尺寸 / 原生壳里都稳。
 */

import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'
import { spiritAssets, sceneAssets } from '../lib/assets'
import { sceneItems } from '../lib/sceneItems'
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
  where: { zh: string; en: string }
}

const OBJECT_STEPS: ObjStep[] = [
  {
    id: 'spirit',
    name: { zh: '面点精灵', en: 'Your spirit' },
    desc: { zh: '我会一直在铺子里陪你。想聊天，随时点我。', en: 'I’ll always be here in the shop. Tap me anytime to talk.' },
    where: { zh: '柜台后', en: 'Behind the counter' },
  },
  {
    id: 'recipeBook',
    name: { zh: '菜谱本', en: 'Recipe book' },
    desc: { zh: '记着你会做的早点。早睡、和客人混熟，手艺会越攒越多。', en: 'The dishes you can make. They grow as you sleep well and befriend guests.' },
    where: { zh: '墙上左侧的菜单板', en: 'The menu board on the left wall' },
  },
  {
    id: 'guestBook',
    name: { zh: '客人电话本', en: 'Guest book' },
    desc: { zh: '来过的客人会一页页攒起来，混熟了还会教你做家乡菜。', en: 'Guests who visit fill it page by page — close ones even teach you their home dishes.' },
    where: { zh: '柜台上', en: 'On the counter' },
  },
  {
    id: 'logbook',
    name: { zh: '营业账本', en: 'Logbook' },
    desc: { zh: '记你几点开门、几点关灯。你最近过得怎么样，都在这本上。', en: 'When you open and close up. How you’ve been lately — it’s all in here.' },
    where: { zh: '柜台上', en: 'On the counter' },
  },
  {
    id: 'messageBoard',
    name: { zh: '黑板', en: 'Message board' },
    desc: { zh: '客人留下的话、铺子的碎语，都贴在这。', en: 'Notes from guests and little murmurs of the shop, pinned here.' },
    where: { zh: '墙上显眼处', en: 'On the wall' },
  },
  {
    id: 'spiritHut',
    name: { zh: '精灵小屋', en: 'My hut' },
    desc: { zh: '我的家，夜里打烊后我回这儿睡。也能在这给我换个点心样子。', en: 'My home — I sleep here after closing. You can also change my pastry look here.' },
    where: { zh: '柜台后角落', en: 'A corner behind the counter' },
  },
]

const TOTAL = OBJECT_STEPS.length + 2 // welcome + objects + finale

export function GuideTour({ spiritName, onGoToEveningPrepare, onFinishToHome }: GuideTourProps) {
  const { lang } = useT()
  const zh = lang === 'zh'
  const [step, setStep] = useState(0)

  const isWelcome = step === 0
  const isFinale = step === TOTAL - 1
  const obj = !isWelcome && !isFinale ? OBJECT_STEPS[step - 1] : null
  const objItem = obj ? sceneItems.find((s) => s.id === obj.id) : undefined

  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      {/* 铺子背景 + 暖色压暗 */}
      <div className="absolute inset-0 bg-[#2a2520]">
        <AssetImage
          src={sceneAssets.mainBackground.src}
          fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
          alt=""
          variant="scene"
          renderFallbackCard={false}
          className="h-full w-full object-cover opacity-25"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 38%, rgba(245,234,216,0.28) 0%, rgba(42,37,32,0.62) 70%)' }}
      />

      {/* 跳过 */}
      <button
        type="button"
        className="absolute right-4 top-[7dvh] z-10 rounded-full bg-white/12 px-4 py-1.5 text-xs text-paper/80 backdrop-blur-sm transition hover:bg-white/20"
        onClick={onFinishToHome}
      >
        {zh ? '跳过' : 'Skip'}
      </button>

      {/* 内容 */}
      <div className="relative z-10 mx-auto flex w-full max-w-[430px] flex-1 flex-col items-center justify-center px-7 text-center">

        {/* 精灵 / 物件主视觉 */}
        <div className="flex h-[34dvh] items-center justify-center">
          {isWelcome || isFinale ? (
            <div style={{ animation: 'tourBob 4s ease-in-out infinite' }}>
              <AssetImage
                src={spiritAssets.base.src}
                fallbackSrc={spiritAssets.base.fallbackSrc}
                alt={spiritName}
                variant="character"
                className="h-40 drop-shadow-[0_10px_30px_rgba(138,97,74,0.28)]"
              />
            </div>
          ) : objItem ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-32 w-32 items-center justify-center rounded-[28px] bg-paper/85 p-4 shadow-[0_12px_30px_rgba(54,38,26,0.3)]">
                <img
                  src={objItem.src}
                  alt={obj!.name[lang]}
                  className="h-full w-full object-contain"
                  onError={(e) => { if (objItem.fallbackSrc) (e.target as HTMLImageElement).src = objItem.fallbackSrc }}
                />
              </div>
              {/* 小精灵在旁边指着 */}
              <AssetImage
                src={spiritAssets.base.src}
                fallbackSrc={spiritAssets.base.fallbackSrc}
                alt={spiritName}
                variant="character"
                className="h-10 opacity-90"
              />
            </div>
          ) : null}
        </div>

        {/* 文案卡 */}
        <div className="mt-2 w-full rounded-[24px] bg-paper/90 px-6 py-6 backdrop-blur-sm shadow-[0_10px_28px_rgba(54,38,26,0.22)]">
          {isWelcome ? (
            <>
              <h1 className="text-xl font-semibold text-ink">
                {zh ? '这家「今晚早点」，现在归你啦' : 'This little shop is yours now'}
              </h1>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                {zh
                  ? `我是${spiritName}，铺子里的面点精灵。先带你认认门，几步就好。`
                  : `I’m ${spiritName}, the dough spirit of this shop. Let me show you around — just a few steps.`}
              </p>
            </>
          ) : isFinale ? (
            <>
              <h1 className="text-xl font-semibold text-ink">
                {zh ? '现在铺子安安静静的，别急' : 'The shop is quiet right now — that’s okay'}
              </h1>
              <p className="mt-3 text-sm leading-7 text-ink/65">
                {zh
                  ? '铺子只在清晨真正热闹。白天我们慢慢备菜，傍晚定个今晚几点关灯——你早点歇，明早就能开门，客人就来。'
                  : 'The shop only truly bustles at dawn. We prep slowly through the day; in the evening we set tonight’s lights-off — rest early and the shop opens to guests tomorrow morning.'}
              </p>
              <p className="mt-3 text-sm leading-6 text-brown/70">
                {zh ? '阿橘说了，明早要来吃油条呢。' : 'Ginger said it’s coming for youtiao tomorrow morning.'}
              </p>
            </>
          ) : obj ? (
            <>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-semibold text-ink">{obj.name[lang]}</h2>
                <span className="rounded-full bg-[#d4a574]/22 px-2.5 py-[2px] text-[11px] font-medium text-[#8a614a]">
                  {obj.where[lang]}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-ink/65">{obj.desc[lang]}</p>
            </>
          ) : null}

          {/* 进度点 */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-4 bg-[#8a614a]/70' : 'w-1.5 bg-ink/25'}`}
              />
            ))}
          </div>

          {/* 导航 */}
          {isFinale ? (
            <div className="mt-5 flex flex-col gap-2">
              <SoftButton type="button" variant="primary" block onClick={onGoToEveningPrepare}>
                {zh ? '去定今晚几点关灯' : 'Set tonight’s lights-off'}
              </SoftButton>
              <button
                type="button"
                className="py-2 text-sm text-ink/45 transition hover:text-ink/65"
                onClick={onFinishToHome}
              >
                {zh ? '先自己逛逛' : 'Look around first'}
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={step === 0}
                className="rounded-full px-4 py-2.5 text-sm text-ink/45 transition hover:text-ink/70 disabled:opacity-0"
                onClick={prev}
              >
                {zh ? '上一步' : 'Back'}
              </button>
              <SoftButton type="button" variant="primary" onClick={next}>
                {zh ? '下一步' : 'Next'}
              </SoftButton>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes tourBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }`}</style>
    </div>
  )
}
