import type { PropsWithChildren, ReactNode } from 'react'

interface AppShellProps extends PropsWithChildren {
  topChrome?: ReactNode
}

export function AppShell({ topChrome, children }: AppShellProps) {
  return (
    <div className="mx-auto h-[100dvh] w-screen max-w-[430px] overflow-hidden bg-[#efe3cf]">
      <div className="relative h-full w-full overflow-hidden">
        {children}
        {topChrome ? <div className="pointer-events-none absolute inset-x-0 top-0 z-40">{topChrome}</div> : null}
      </div>
    </div>
  )
}
