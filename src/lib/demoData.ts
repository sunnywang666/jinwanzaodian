import { foodAssets, spiritAssets } from './assets'
import type { AssetSource } from './assets'
import type { LogEntry, NightType, ShopMood, SpiritBody, SpiritForm } from './storage'

export interface PersonaOption {
  key: string
  label: string
  result: NightType
}

export interface PersonaQuestion {
  question: string
  options: PersonaOption[]
}

export interface Dish {
  key: string
  name: string
  image: AssetSource
  description: string
  lovedBy: string
  origin: string
}

export interface SpiritOption {
  form: SpiritForm
  name: string
  note: string
  image: AssetSource
  src: string
  fallbackSrc?: string
  unlocked: boolean
}

export interface OnboardingSkinOption {
  form: SpiritBody
  name: string
  image: AssetSource
}

export interface ChatMessage {
  id: string
  speaker: 'spirit' | 'user'
  text: string
}

const revengeType = '报复型' as NightType
const habitType = '惯性型' as NightType
const anxietyType = '焦虑型' as NightType
const workType = '工作型' as NightType
const undefinedType = '说不清' as NightType

const busyMood = '热闹' as ShopMood
const normalMood = '平常' as ShopMood
const quietMood = '安静' as ShopMood

export const personaQuestions: PersonaQuestion[] = [
  {
    question: '到了该睡的时候，你最常见的状态是？',
    options: [
      { key: 'revenge', label: '今天终于属于我了', result: revengeType },
      { key: 'habit', label: '再刷一下就睡', result: habitType },
      { key: 'anxiety', label: '脑子停不下来', result: anxietyType },
      { key: 'work', label: '活儿还没做完', result: workType },
    ],
  },
  {
    question: '如果有人叫你早点睡，你通常会？',
    options: [
      { key: 'revenge', label: '有点烦，不想被管', result: revengeType },
      { key: 'habit', label: '答应，但手还是停不下来', result: habitType },
      { key: 'anxiety', label: '更焦虑', result: anxietyType },
      { key: 'work', label: '觉得我还没资格睡', result: workType },
    ],
  },
  {
    question: '夜里你最常在做什么？',
    options: [
      { key: 'revenge', label: '刷手机、看剧、打游戏', result: revengeType },
      { key: 'habit', label: '也没干什么，就是没放下手机', result: habitType },
      { key: 'anxiety', label: '翻来覆去想事情', result: anxietyType },
      { key: 'work', label: '加班或者赶东西', result: workType },
    ],
  },
  {
    question: '你跟早晨的关系是？',
    options: [
      { key: 'revenge', label: '闹钟的仇人，能赖就赖', result: revengeType },
      { key: 'habit', label: '起来了就还好，就是起不来', result: habitType },
      { key: 'anxiety', label: '醒得很早，但感觉没休息够', result: anxietyType },
      { key: 'work', label: '有事才起得来，没事就废了', result: workType },
    ],
  },
  {
    question: '你最希望被怎样陪伴？',
    options: [
      { key: 'revenge', label: '先让我开心一下', result: revengeType },
      { key: 'habit', label: '帮我停下来', result: habitType },
      { key: 'anxiety', label: '帮我清空脑子', result: anxietyType },
      { key: 'work', label: '帮我把事情放到明天', result: workType },
    ],
  },
]

export const onboardingSkins: OnboardingSkinOption[] = [
  { form: 'base', name: '白面团', image: spiritAssets.base },
  { form: 'xiaolongbao', name: '小笼包', image: spiritAssets.xiaolongbao },
  { form: 'bagel', name: '贝果', image: spiritAssets.bagel },
  { form: 'croissant', name: '可颂', image: spiritAssets.croissant },
]

export const dishes: Dish[] = [
  {
    key: 'bun',
    name: '包子',
    image: foodAssets.bun,
    description: '每天都能稳稳出锅。',
    lovedBy: '小熊栗子',
    origin: '开张就会做的招牌手艺。',
  },
  {
    key: 'soy-milk',
    name: '豆浆',
    image: foodAssets.soyMilk,
    description: '越做越顺手，早晨最先卖完。',
    lovedBy: '小浣熊灰灰、小鸟蓝蓝',
    origin: '和精灵白天试了两次比例。',
  },
  {
    key: 'youtiao',
    name: '油条',
    image: foodAssets.youtiao,
    description: '阿橘每次来都先看它。',
    lovedBy: '橘猫阿橘',
    origin: '清晨热闹起来后解锁。',
  },
  {
    key: 'millet-porridge',
    name: '小米粥',
    image: foodAssets.milletPorridge,
    description: '慢慢喝完一整碗，心也会慢一点。',
    lovedBy: '小狐狸桂花',
    origin: '连续几次好好打烊后研究出来。',
  },
  {
    key: 'tremella-porridge',
    name: '银耳枸杞粥',
    image: foodAssets.tremellaPorridge,
    description: '温柔一点的早晨限定。',
    lovedBy: '小狐狸桂花',
    origin: '熟客带来的家乡做法。',
  },
]

// 小屋里可切换的四个身体，与 onboarding 一致，都可自由选择（不再靠早睡解锁）。
export const spiritOptions: SpiritOption[] = [
  {
    form: 'base',
    name: '白面团',
    note: '最初的小圆面团。',
    image: spiritAssets.base,
    src: spiritAssets.base.src,
    fallbackSrc: spiritAssets.base.fallbackSrc,
    unlocked: true,
  },
  {
    form: 'xiaolongbao',
    name: '小笼包',
    note: '圆乎乎的小笼包。',
    image: spiritAssets.xiaolongbao,
    src: spiritAssets.xiaolongbao.src,
    fallbackSrc: spiritAssets.xiaolongbao.fallbackSrc,
    unlocked: true,
  },
  {
    form: 'bagel',
    name: '贝果',
    note: '圆圆一圈的贝果。',
    image: spiritAssets.bagel,
    src: spiritAssets.bagel.src,
    fallbackSrc: spiritAssets.bagel.fallbackSrc,
    unlocked: true,
  },
  {
    form: 'croissant',
    name: '可颂',
    note: '酥酥的弯月形。',
    image: spiritAssets.croissant,
    src: spiritAssets.croissant.src,
    fallbackSrc: spiritAssets.croissant.fallbackSrc,
    unlocked: true,
  },
]

function formatDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/** 把某天 + "HH:MM" 组成一个本地时刻 */
function atTime(base: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h ?? 0, m ?? 0, 0, 0)
}

export function resolvePersona(answers: string[]): NightType {
  const counts = answers.reduce<Record<string, number>>((result, answer) => {
    result[answer] = (result[answer] ?? 0) + 1
    return result
  }, {})

  const match = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const option = personaQuestions.flatMap((question) => question.options).find((item) => item.key === match)
  return option?.result ?? undefinedType
}

export function createDefaultLogEntries(): LogEntry[] {
  const moods: ShopMood[] = [normalMood, busyMood, normalMood, quietMood, normalMood, busyMood, normalMood]
  const closes = ['23:10', '22:50', '23:20', '23:45', '23:05', '22:40', '23:15']
  const opens = ['07:20', '06:55', '07:10', '07:45', '07:18', '06:50', '07:05']
  const guestCounts = [6, 8, 7, 4, 6, 9, 7]
  const notes = ['按时打烊', '熄灯后很快安静下来', '写了纸条再去睡', '稍微晚了些，但还是关了灯', '陪到打烊', '早早就把灯关掉了', '平稳收摊']
  // 打烊后磨蹭多久才真放下手机（分钟）+ 夜里又拿起手机的次数 → 让睡眠分析有料可演示
  const settleDelays = [6, 4, 18, 50, 8, 3, 22]
  const nightWakes = [0, 0, 1, 2, 0, 0, 1]

  return Array.from({ length: 7 }, (_, index) => {
    const closeDate = new Date()
    closeDate.setDate(closeDate.getDate() - index)
    const nextMorning = new Date(closeDate)
    nextMorning.setDate(nextMorning.getDate() + 1)

    const realClose = atTime(closeDate, closes[index] ?? '23:10')
    const screenOff = new Date(realClose.getTime() + (settleDelays[index] ?? 5) * 60000)
    const realOpen = atTime(nextMorning, opens[index] ?? '07:12')

    return {
      date: formatDate(closeDate),
      openTime: opens[index] ?? '07:12',
      closeTime: closes[index] ?? '23:10',
      shopMood: moods[index] ?? normalMood,
      guestCount: guestCounts[index] ?? 6,
      closingNote: notes[index] ?? '平稳收摊',
      realCloseTimestamp: realClose.toISOString(),
      screenOffTimestamp: screenOff.toISOString(),
      realOpenTimestamp: realOpen.toISOString(),
      nightWakes: nightWakes[index] ?? 0,
      // 让演示版这 7 晚算作"熄屏早睡"，使累计早睡/成就/皮肤进度在路演时是活的
      isRealData: true,
    }
  })
}

export function getGuestCountByMood(mood: 'busy' | 'normal' | 'quiet'): number {
  switch (mood) {
    case 'busy': return 7 + Math.floor(Math.random() * 3)
    case 'normal': return 4 + Math.floor(Math.random() * 3)
    case 'quiet': return 2 + Math.floor(Math.random() * 2)
  }
}

