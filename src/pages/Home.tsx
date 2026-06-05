import { getSceneAsset } from '../lib/assets'
import { sceneCopy } from '../lib/demoData'
import type { AppPage, DemoScene } from '../lib/storage'
import { AssetImage } from '../components/AssetImage'

interface HomeProps {
  scene: DemoScene
  tonightClosed: boolean
  onNavigate: (page: AppPage) => void
}

const entryCards: Array<{ page: AppPage; title: string; note: string }> = [
  { page: 'menu', title: '菜单', note: '翻开菜谱本' },
  { page: 'guestbook', title: '电话本', note: '看看来过谁' },
  { page: 'logbook', title: '账本', note: '翻最近几天' },
  { page: 'spiritHut', title: '精灵小屋', note: '换形态和聊天' },
]

export function Home({ scene, tonightClosed, onNavigate }: HomeProps) {
  const copy = sceneCopy[scene]

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="overflow-hidden rounded-[30px] border border-line bg-cream">
        <AssetImage src={getSceneAsset(scene)} alt="铺子主画面" variant="scene" className="h-[300px]" />
      </div>

      <div className="mt-4 rounded-[28px] border border-line bg-white/80 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-ink">{copy.title}</h1>
            <p className="mt-1 text-sm leading-5 text-ink/70">{copy.body}</p>
          </div>
          <span className="paper-label shrink-0">{tonightClosed ? '已熄灯' : copy.mood}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {entryCards.map((card) => (
          <button
            key={card.page}
            type="button"
            className="min-h-24 rounded-[28px] border border-line bg-paper px-4 py-4 text-left shadow-sm"
            onClick={() => onNavigate(card.page)}
          >
            <p className="text-lg font-semibold text-ink">{card.title}</p>
            <p className="mt-2 text-sm text-ink/65">{card.note}</p>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto rounded-[28px] border border-brown bg-butter px-4 py-4 text-left text-ink shadow-sm"
        onClick={() => onNavigate('demoMode')}
      >
        <p className="text-base font-semibold">演示模式</p>
        <p className="mt-1 text-sm text-ink/70">切换热闹、安静、备菜、打烊和熄灯状态</p>
      </button>
    </section>
  )
}
