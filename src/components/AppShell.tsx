import type { PropsWithChildren } from 'react'
import type { AppPage } from '../lib/storage'
import { SoftButton } from './SoftButton'

interface AppShellProps extends PropsWithChildren {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
  statusText: string
  headerAction?: {
    label: string
    onClick: () => void
  }
}

const navItems: Array<{ page: AppPage; label: string }> = [
  { page: 'home', label: '铺子' },
  { page: 'menu', label: '菜单' },
  { page: 'guestbook', label: '电话本' },
  { page: 'logbook', label: '账本' },
  { page: 'spiritHut', label: '精灵小屋' },
]

function getShellPage(activePage: AppPage) {
  if (navItems.some((item) => item.page === activePage)) {
    return activePage
  }

  return 'home'
}

export function AppShell({ activePage, onNavigate, statusText, headerAction, children }: AppShellProps) {
  const shellPage = getShellPage(activePage)
  const nowLabel = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  return (
    <div className="mx-auto min-h-screen max-w-[430px] px-3 py-4">
      <div className="paper-panel flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden">
        <header className="border-b border-line px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="paper-label">今晚早点</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-[0.04em] text-ink">今晚早点</h1>
              <p className="mt-2 text-sm text-ink/75">{statusText}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="paper-label">{nowLabel}</span>
              {headerAction ? (
                <SoftButton type="button" variant="ghost" onClick={headerAction.onClick}>
                  {headerAction.label}
                </SoftButton>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,249,241,0.75),rgba(246,239,226,0.95))] px-4 py-4">
          {children}
        </main>

        <nav className="grid grid-cols-5 gap-2 border-t border-line bg-white/70 px-3 py-3">
          {navItems.map((item) => {
            const active = shellPage === item.page

            return (
              <button
                key={item.page}
                type="button"
                className={`rounded-2xl border px-2 py-2 text-xs transition ${
                  active
                    ? 'border-brown bg-butter/80 text-ink'
                    : 'border-transparent bg-transparent text-ink/70 hover:border-line hover:bg-white/70'
                }`}
                onClick={() => onNavigate(item.page)}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
