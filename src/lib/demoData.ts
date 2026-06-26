import { foodAssets, spiritAssets } from './assets'
import type { AssetSource } from './assets'
import type { DemoScene, LogEntry, NightType, ShopMood, SpiritBody, SpiritForm } from './storage'

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
const owlType = '猫头鹰型' as NightType
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

export const personaCopy = {
  [revengeType]: '你不是不困，只是想把一点属于自己的时间拿回来。',
  [habitType]: '你知道差不多该停了，只是手和眼睛还没一起停下来。',
  [anxietyType]: '夜里最吵的不是手机，是脑子里还没放下的事情。',
  [workType]: '你总想把事情做完再休息，可铺子也需要店长先关灯。',
  [owlType]: '你的节奏天生更晚一点，铺子会更柔和地陪你调整。',
  [undefinedType]: '今晚先不用急着定义自己，铺子会慢慢陪你看清节奏。',
} as Record<NightType, string>

export const onboardingSkins: OnboardingSkinOption[] = [
  { form: 'base', name: '白面团', image: spiritAssets.base },
  { form: 'xiaolongbao', name: '小笼包', image: spiritAssets.xiaolongbao },
  { form: 'bagel', name: '贝果', image: spiritAssets.bagel },
  { form: 'croissant', name: '可颂', image: spiritAssets.croissant },
]

export const demoSceneOptions: Array<{ key: DemoScene; label: string }> = [
  { key: 'busy', label: '热闹' },
  { key: 'quiet', label: '安静' },
  { key: 'daytime', label: '备菜' },
  { key: 'nap', label: '打盹' },
  { key: 'evening', label: '傍晚' },
  { key: 'night', label: '打烊' },
  { key: 'lightsOff', label: '熄灯' },
]

export const sceneCopy: Record<DemoScene, { title: string; body: string; mood: ShopMood }> = {
  cover: { title: '铺子刚刚开门', body: '柜台后有一点暖光，今天也从这里开始。', mood: normalMood },
  busy: { title: '清晨热闹起来了', body: '昨晚睡得早些，今天来吃早点的人也多些。', mood: busyMood },
  normal: { title: '平常的一天', body: '没有哪里需要被责怪，铺子稳稳开着。', mood: normalMood },
  quiet: { title: '今天安静一点', body: '门照常开着，明天也还在。', mood: quietMood },
  daytime: { title: '白天在备菜', body: '你和精灵一起揉面、擦柜台、准备明天。', mood: normalMood },
  nap: { title: '午后短短打个盹', body: '这只是铺子里的松弛片刻，不算任务。', mood: normalMood },
  evening: { title: '傍晚准备明天', body: '先把关灯时间和心事都写下来。', mood: normalMood },
  night: { title: '该关灯歇业了', body: '把铺子收好，再把手机放远一点。', mood: quietMood },
  lightsOff: { title: '铺子已经熄灯', body: '灯关了，剩下的夜晚会自己安静下来。', mood: quietMood },
}

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
    note: '第一层点心外表。',
    image: spiritAssets.xiaolongbao,
    src: spiritAssets.xiaolongbao.src,
    fallbackSrc: spiritAssets.xiaolongbao.fallbackSrc,
    unlocked: true,
  },
  {
    form: 'croissant',
    name: '可颂',
    note: '酥酥的弯月形。',
    image: spiritAssets.croissant,
    src: spiritAssets.croissant.src,
    fallbackSrc: spiritAssets.croissant.fallbackSrc,
    unlocked: false,
  },
  {
    form: 'donut',
    name: '贝果',
    note: '圆圆一圈，还是那双豆豆眼。',
    image: spiritAssets.bagel,
    src: spiritAssets.bagel.src,
    fallbackSrc: spiritAssets.bagel.fallbackSrc,
    unlocked: false,
  },
  {
    form: 'sleep',
    name: '迷糊贝果',
    note: '有点刚睡醒的样子。',
    image: spiritAssets.confusedBagel,
    src: spiritAssets.confusedBagel.src,
    fallbackSrc: spiritAssets.confusedBagel.fallbackSrc,
    unlocked: false,
  },
]

export const initialChatMessages: ChatMessage[] = [
  { id: 'intro-1', speaker: 'spirit', text: '店长，今天铺子开着。我在柜台后面，先陪你待一会儿。' },
  { id: 'intro-2', speaker: 'user', text: '我只是来看看铺子。' },
  { id: 'intro-3', speaker: 'spirit', text: '看看就好。今天不用急着把所有事都整理清楚。' },
]

export const quickReplies: Array<{ label: string; response: string }> = [
  { label: '昨晚又晚了', response: '没关系，铺子今天只是安静一点。我们先把豆浆热一热。' },
  { label: '今天有点累', response: '那今天就少做一点，铺子也可以慢慢来。' },
  { label: '今晚想早点关灯', response: '好呀，我们傍晚先把明天的小纸条写好。' },
]

export const messageBoardNotes = [
  '今天的油条很好吃。——阿橘',
  '早上窗边的光很安静。——蓝蓝',
  '没关系，明天见。——铺子',
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
    }
  })
}

export interface MiddayTransitionCopyEntry {
  title: string
  body: (spiritName: string) => string
}

export const morningGreetings = {
  closed: {
    title: '\u65E9\u5B89\uFF0C\u5E97\u957F',
    body: (spiritName: string) => spiritName + ' \u5DF2\u7ECF\u5728\u67DC\u53F0\u540E\u9762\u7B49\u4F60\u4E86\u3002\u6628\u665A\u4F11\u606F\u5F97\u4E0D\u9519\uFF0C\u4ECA\u5929\u4ECE\u5BB9\u4E00\u70B9\u3002',
  },
  notClosed: {
    title: '\u65E9\u5B89\uFF0C\u5E97\u957F',
    body: (spiritName: string) => spiritName + ' \u63C9\u4E86\u63C9\u773C\u775B\uFF0C\u6253\u4E86\u4E2A\u54C8\u6B20\u3002\u6628\u665A\u94FA\u5B50\u6CA1\u6765\u5F97\u53CA\u6253\u70CA\uFF0C\u4E0D\u8FC7\u6CA1\u5173\u7CFB\uFF0C\u4ECA\u5929\u4E5F\u7167\u5E38\u5F00\u95E8\u3002',
  },
}

export const middayTransitionCopy: Record<'busy' | 'normal' | 'quiet', MiddayTransitionCopyEntry> = {
  busy: {
    title: '\u65E9\u70B9\u5FEB\u5356\u5B8C\u5566',
    body: (spiritName: string) => spiritName + '\uFF1A\u4ECA\u5929\u771F\u70ED\u95F9\uFF01\u4E0B\u5348\u54B1\u4EEC\u4E00\u8D77\u5907\u83DC\uFF0C\u8BD5\u8BD5\u65B0\u914D\u65B9\u3002',
  },
  normal: {
    title: '\u4E0A\u5348\u6536\u644A\u4E86',
    body: (spiritName: string) => spiritName + '\uFF1A\u5E73\u5E38\u7684\u4E00\u5929\u4E5F\u631A\u597D\u7684\u3002\u4E0B\u5348\u4E00\u8D77\u64E6\u64E6\u67DC\u53F0\u5427\u3002',
  },
  quiet: {
    title: '\u4E0A\u5348\u7ED3\u675F\u4E86',
    body: (spiritName: string) => spiritName + '\uFF1A\u4ECA\u5929\u5B89\u9759\u4E00\u70B9\uFF0C\u4E0D\u8FC7\u95E8\u7167\u5E38\u5F00\u7740\u3002\u4E0B\u5348\u6162\u6162\u6765\u3002',
  },
}

export function getGuestCountByMood(mood: 'busy' | 'normal' | 'quiet'): number {
  switch (mood) {
    case 'busy': return 7 + Math.floor(Math.random() * 3)
    case 'normal': return 4 + Math.floor(Math.random() * 3)
    case 'quiet': return 2 + Math.floor(Math.random() * 2)
  }
}

