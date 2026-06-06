import type { PropsWithChildren } from 'react'

interface AppShellProps extends PropsWithChildren {
  statusText: string
  headerAction?: {
    label: string
    onClick: () => void
  }
}

export function AppShell({ statusText, headerAction, children }: AppShellProps) {
  const nowLabel = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-3 py-3">
      <div className="paper-panel relative flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden">
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

        <main className="relative min-h-0 flex-1 overflow-hidden bg-[linear-gradient(180deg,rgba(255,249,241,0.78),rgba(246,239,226,0.98))]">
          {children}
        </main>
      </div>
    </div>
  )
}
