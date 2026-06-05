import { getSceneAsset } from '../lib/assets'
import { sceneCopy } from '../lib/demoData'
import type { DemoScene } from '../lib/storage'
import { AssetImage } from '../components/AssetImage'
import { DemoControls } from '../components/DemoControls'
import { SoftButton } from '../components/SoftButton'

interface HomeProps {
  scene: DemoScene
  spiritName: string
  tonightClosed: boolean
  onSceneChange: (scene: DemoScene) => void
  onOpenEveningPrepare: () => void
  onOpenNightClosing: () => void
}

export function Home({
  scene,
  spiritName,
  tonightClosed,
  onSceneChange,
  onOpenEveningPrepare,
  onOpenNightClosing,
}: HomeProps) {
  const copy = sceneCopy[scene]

  return (
    <div className="space-y-4">
      <section className="paper-panel overflow-hidden">
        <AssetImage
          src={getSceneAsset(scene)}
          alt="铺子主视觉"
          className="h-[260px] w-full bg-cream object-cover"
        />
        <div className="space-y-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="paper-label">铺子主画面</span>
            <span className="paper-label">{copy.mood}</span>
            {tonightClosed ? <span className="paper-label">今晚已熄灯</span> : null}
          </div>
          <div>
            <h2 className="ink-title">{copy.title}</h2>
            <p className="mt-2 ink-note">{copy.body}</p>
          </div>
        </div>
      </section>

      <section className="paper-panel px-4 py-4">
        <h2 className="ink-title">演示状态</h2>
        <p className="mt-2 ink-note">
          默认封面先使用 `cover-shop.png`。其余时段场景会优先取约定文件名，缺图时统一显示占位卡。
        </p>
        <div className="mt-4">
          <DemoControls currentScene={scene} onChange={onSceneChange} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3">
        <div className="paper-panel px-4 py-4">
          <p className="paper-label">傍晚</p>
          <h3 className="mt-3 text-base font-semibold text-ink">准备打烊</h3>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            {spiritName} 会先陪你把今晚放不下的事写成一张小纸条，再把关灯时间定下来。
          </p>
          <SoftButton className="mt-4" type="button" variant="primary" onClick={onOpenEveningPrepare}>
            去准备
          </SoftButton>
        </div>

        <div className="paper-panel px-4 py-4">
          <p className="paper-label">夜晚</p>
          <h3 className="mt-3 text-base font-semibold text-ink">打烊流程</h3>
          <p className="mt-2 text-sm leading-6 text-ink/75">
            关小灯、拉卷帘、让精灵回小屋睡。流程完成后会记录 `tonightClosed = true` 并切到熄灯状态。
          </p>
          <SoftButton className="mt-4" type="button" onClick={onOpenNightClosing}>
            去打烊
          </SoftButton>
        </div>
      </section>
    </div>
  )
}
