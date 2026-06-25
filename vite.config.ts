import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/jinwanzaodian/' : '/',
  // 把真实版本号注入前端，设置页"关于"自动显示，不再写死
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  test: {
    // 纯逻辑单测，无需 DOM
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}))
