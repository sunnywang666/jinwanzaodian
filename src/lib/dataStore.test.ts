import { describe, it, expect } from 'vitest'
import { validateAndRepair, createDefaultStore, type AppStore } from './dataStore'

// 用一个完整的默认 store 起手，再删掉/破坏某个字段，验证 validateAndRepair 能补回
function storeMissing(mutate: (s: AppStore) => void): AppStore {
  const s = createDefaultStore()
  mutate(s)
  return s
}

describe('validateAndRepair', () => {
  it('backfills today.homeGuestKeys for old saves missing the field', () => {
    const s = storeMissing((s) => { delete (s.today as any).homeGuestKeys })
    expect(validateAndRepair(s).today.homeGuestKeys).toEqual([])
  })

  it('resets a corrupted homeGuestKeys (non-array) to []', () => {
    const s = storeMissing((s) => { (s.today as any).homeGuestKeys = 'oops' })
    expect(validateAndRepair(s).today.homeGuestKeys).toEqual([])
  })

  it('backfills today.eveningPrepare when missing', () => {
    const s = storeMissing((s) => { delete (s.today as any).eveningPrepare })
    expect(validateAndRepair(s).today.eveningPrepare).toBeDefined()
    expect(validateAndRepair(s).today.eveningPrepare.plannedLightsOffTime).toBe('23:00')
  })

  it('backfills settings.reminders field-by-field', () => {
    const s = storeMissing((s) => { (s.settings as any).reminders = { eveningEnabled: true } })
    const r = validateAndRepair(s).settings.reminders
    expect(r.eveningEnabled).toBe(true)
    expect(typeof r.eveningTime).toBe('string')
    expect(typeof r.closingEnabled).toBe('boolean')
  })

  it('sets tourDone from profile presence when missing', () => {
    const withProfile = storeMissing((s) => {
      delete (s.settings as any).tourDone
      s.profile = { nightType: '说不清' as any, personaAnswers: [], spiritAppearance: 'base' as any, spiritName: '阿团', defaultLightsOffTime: '23:00' }
    })
    expect(validateAndRepair(withProfile).settings.tourDone).toBe(true)

    const noProfile = storeMissing((s) => { delete (s.settings as any).tourDone; s.profile = null })
    expect(validateAndRepair(noProfile).settings.tourDone).toBe(false)
  })

  it('resets corrupted arrays and re-adds the base spirit form', () => {
    const s = storeMissing((s) => {
      (s as any).days = null
      s.spirit.progress.unlockedForms = ['xiaolongbao']
    })
    const r = validateAndRepair(s)
    expect(Array.isArray(r.days)).toBe(true)
    expect(r.spirit.progress.unlockedForms).toContain('base')
  })
})
