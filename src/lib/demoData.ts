import { animalAssets, foodAssets, spiritAssets } from './assets'
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

export interface GuestEntry {
  key: keyof typeof animalAssets
  name: string
  image: AssetSource
  description: string
  favoriteFood: string
  visitCount: number
  familiarity: string
  status: string
  story: string
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
    lovedBy: '小狐狸橘橘',
    origin: '连续几次好好打烊后研究出来。',
  },
  {
    key: 'tremella-porridge',
    name: '银耳枸杞粥',
    image: foodAssets.tremellaPorridge,
    description: '温柔一点的早晨限定。',
    lovedBy: '小麻雀啾啾',
    origin: '熟客带来的家乡做法。',
  },
]

export const guests: GuestEntry[] = [
  {
    key: 'cat',
    name: '橘猫阿橘',
    image: animalAssets.cat,
    description: '总是第一个来，但只轻轻点头。',
    favoriteFood: '油条',
    visitCount: 9,
    familiarity: '已经会坐在窗边等开门',
    status: '熟客',
    story: '它今天还是没说很多话，但把豆浆喝得很干净。',
  },
  {
    key: 'rabbit',
    name: '白兔小团',
    image: animalAssets.rabbit,
    description: '喜欢慢慢喝完一整碗热粥。',
    favoriteFood: '粥',
    visitCount: 6,
    familiarity: '见面会主动问你昨晚睡得如何',
    status: '常来',
    story: '它把耳朵搭在碗边，等粥不烫了才开始喝。',
  },
  {
    key: 'raccoon',
    name: '小浣熊灰灰',
    image: animalAssets.raccoon,
    description: '手里总想拿点什么，停下来时反而很乖。',
    favoriteFood: '豆浆',
    visitCount: 5,
    familiarity: '会把杯子整齐放回柜台',
    status: '渐熟',
    story: '它今天没有东张西望，只是安静喝完了豆浆。',
  },
  {
    key: 'bear',
    name: '小熊栗子',
    image: animalAssets.bear,
    description: '抱着热包子时最安心。',
    favoriteFood: '包子',
    visitCount: 4,
    familiarity: '已经记得自己的小凳子',
    status: '常来',
    story: '它把包子捧在手里很久，好像不急着吃。',
  },
  {
    key: 'fox',
    name: '小狐狸橘橘',
    image: animalAssets.fox,
    description: '看起来很精神，其实也会困。',
    favoriteFood: '小米粥',
    visitCount: 3,
    familiarity: '开始愿意在门口多坐一会儿',
    status: '新熟',
    story: '它今天来得很早，只说想喝一点暖的。',
  },
  {
    key: 'sparrow',
    name: '小麻雀啾啾',
    image: animalAssets.sparrow,
    description: '小小一只，但很认真地记得路。',
    favoriteFood: '银耳枸杞粥',
    visitCount: 2,
    familiarity: '还在熟悉铺子的味道',
    status: '新客',
    story: '它站在窗边看了很久，最后还是飞进来了。',
  },
  {
    key: 'bird',
    name: '小鸟蓝蓝',
    image: animalAssets.bird,
    description: '喜欢安静的早晨声音。',
    favoriteFood: '豆浆',
    visitCount: 2,
    familiarity: '会在收音机旁边停一会儿',
    status: '新客',
    story: '今天收音机声音很轻，它好像很喜欢。',
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

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - index)

    return {
      date: formatDate(date),
      openTime: opens[index] ?? '07:12',
      closeTime: closes[index] ?? '23:10',
      shopMood: moods[index] ?? normalMood,
      guestCount: guestCounts[index] ?? 6,
      closingNote: notes[index] ?? '平稳收摊',
    }
  })
}

export const morningGreetings = {
  closed: {
    title: '鏃╁畨锛屽簵闀�',
    body: (spiritName: string) => `${spiritName} 宸茬粡鍦ㄦ煖鍙板悗闈㈢瓑浣犱簡銆傛槰鏅氫紤鎭緱涓嶉敊锛屼粖澶╀粠瀹逛竴鐐广€�`,
  },
  notClosed: {
    title: '鏃╁畨锛屽簵闀�',
    body: (spiritName: string) => `${spiritName} 鎻変簡鎻夌溂鐫涳紝鎵撲簡涓搱娆犮€傛槰鏅氶摵瀛愭病鏉ュ緱鍙婃墦鐑婏紝涓嶈繃娌″叧绯伙紝浠婂ぉ涔熺収甯稿紑闂ㄣ€�`,
  },
}

export const middayTransitionCopy: Record<'busy' | 'normal' | 'quiet', {
  title: string
  body: (spiritName: string) => string
}> = {
  busy: {
    title: '鏃╃偣蹇崠瀹屽暒',
    body: (spiritName: string) => `${spiritName}锛氫粖澶╃湡鐑椆锛佷笅鍗堝挶浠竴璧峰鑿滐紝璇曡瘯鏂伴厤鏂广€�`,
  },
  normal: {
    title: '涓婂崍鏀舵憡浜�',
    body: (spiritName: string) => `${spiritName}锛氬钩甯哥殑涓€澶╀篃鎸哄ソ鐨勩€備笅鍗堜竴璧锋摝鎿︽煖鍙板惂銆€�`,
  },
  quiet: {
    title: '涓婂崍缁撴潫浜�',
    body: (spiritName: string) => `${spiritName}锛氫粖澶╁畨闈欎竴鐐癸紝涓嶈繃闂ㄧ収甯稿紑鐫€銆備笅鍗堟參鎱㈡潵銆€�`,
  },
}

export function getGuestCountByMood(mood: 'busy' | 'normal' | 'quiet'): number {
  switch (mood) {
    case 'busy':
      return 7 + Math.floor(Math.random() * 3)
    case 'normal':
      return 4 + Math.floor(Math.random() * 3)
    case 'quiet':
      return 2 + Math.floor(Math.random() * 2)
  }
}
