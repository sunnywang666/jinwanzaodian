import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/jinwanzaodian/' : '/',
  test: {
    // 纯逻辑单测，无需 DOM
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}))
