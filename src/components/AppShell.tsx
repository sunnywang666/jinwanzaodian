import type { PropsWithChildren } from 'react'
import type { AppPage } from '../lib/storage'

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

  if (activePage === 'guestDetail') {
    return 'guestbook'
  }

  if (activePage === 'spiritChat') {
    return 'spiritHut'
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
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-3 py-3">
      <div className="paper-panel flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-line bg-paper px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="paper-label">今晚早点</span>
                <span className="paper-label">{nowLabel}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink/75">{statusText}</p>
            </div>
            {headerAction ? (
              <button
                type="button"
                className="shrink-0 rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs text-brown"
                onClick={headerAction.onClick}
              >
                {headerAction.label}
              </button>
            ) : null}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden bg-[linear-gradient(180deg,rgba(255,249,241,0.82),rgba(246,239,226,0.96))]">
          {children}
        </main>

        <nav className="grid shrink-0 grid-cols-5 gap-2 border-t border-line bg-white/75 px-3 py-2">
          {navItems.map((item) => {
            const active = shellPage === item.page

            return (
              <button
                key={item.page}
                type="button"
                className={`min-h-12 rounded-2xl border px-1.5 text-[11px] transition ${
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
