import { animalAssets, foodAssets, spiritAssets } from './assets'
import type { AssetSource } from './assets'
import type { DemoScene, LogEntry, NightType, ShopMood, SpiritForm } from './storage'

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
  favorite: string
  visits: number
  closeness: string
  status: string
  line: string
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

export interface ChatMessage {
  id: string
  speaker: 'spirit' | 'user'
  text: string
}

export const personaQuestions: PersonaQuestion[] = [
  {
    question: '到了该睡的时候，你最常见的状态是？',
    options: [
      { key: 'revenge', label: '今天终于属于我了', result: '报复型' },
      { key: 'habit', label: '再刷一下就睡', result: '惯性型' },
      { key: 'anxiety', label: '脑子停不下来', result: '焦虑型' },
      { key: 'work', label: '活儿还没做完', result: '工作型' },
    ],
  },
  {
    question: '如果有人叫你早点睡，你通常会？',
    options: [
      { key: 'revenge', label: '有点烦，不想被管', result: '报复型' },
      { key: 'habit', label: '答应，但手还是停不下来', result: '惯性型' },
      { key: 'anxiety', label: '更焦虑', result: '焦虑型' },
      { key: 'work', label: '觉得我还没资格睡', result: '工作型' },
    ],
  },
  {
    question: '你最希望被怎样陪伴？',
    options: [
      { key: 'revenge', label: '先让我开心一下', result: '报复型' },
      { key: 'habit', label: '帮我停下来', result: '惯性型' },
      { key: 'anxiety', label: '帮我清空脑子', result: '焦虑型' },
      { key: 'work', label: '帮我把事情放到明天', result: '工作型' },
    ],
  },
]

export const personaCopy: Record<NightType, string> = {
  报复型: '你不是不困，只是想把一点属于自己的时间拿回来。',
  惯性型: '你知道差不多该停了，只是手和眼睛还没一起停下来。',
  焦虑型: '夜里最吵的不是手机，是脑子里还没放下的事情。',
  工作型: '你总想把事情做完再休息，可铺子也需要店长先关灯。',
  猫头鹰型: '你的节奏天生更晚一点，铺子会更柔和地陪你调整。',
  说不清: '今晚先不用急着定义自己，铺子会慢慢陪你看清节奏。',
}

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
  cover: { title: '铺子刚刚开门', body: '柜台后有一点暖光，今天也从这里开始。', mood: '平常' },
  busy: { title: '清晨热闹起来了', body: '昨晚歇得早些，今天来吃早点的人也多些。', mood: '热闹' },
  normal: { title: '平常的一天', body: '没有哪里需要被责怪，铺子稳稳开着。', mood: '平常' },
  quiet: { title: '今天安静一点', body: '门照常开着，明天也还在。', mood: '安静' },
  daytime: { title: '白天在备菜', body: '你和精灵一起揉面、擦柜台、准备明天。', mood: '平常' },
  nap: { title: '午后短短打个盹', body: '这只是铺子里的松弛片刻，不算任务。', mood: '平常' },
  evening: { title: '傍晚准备明天', body: '先把关灯时间和心事都写下来。', mood: '平常' },
  night: { title: '该关灯歇业了', body: '把铺子收好，再把手机放远一点。', mood: '安静' },
  lightsOff: { title: '铺子已经熄灯', body: '灯关了，剩下的夜晚会自己安静下来。', mood: '安静' },
}

export const dishes: Dish[] = [
  {
    key: 'bun',
    name: '包子',
    image: foodAssets.bun,
    description: '每天都能稳稳出锅。',
    lovedBy: '小熊栗子',
    origin: '开张就会做的招牌手艺',
  },
  {
    key: 'soy-milk',
    name: '豆浆',
    image: foodAssets.soyMilk,
    description: '越做越顺手，早晨最先卖完。',
    lovedBy: '小兔小团',
    origin: '和精灵白天试了两次比例',
  },
  {
    key: 'youtiao',
    name: '油条',
    image: foodAssets.youtiao,
    description: '阿墨每次来都先看它。',
    lovedBy: '黑猫阿墨',
    origin: '清晨热闹起来后解锁',
  },
  {
    key: 'millet-porridge',
    name: '小米粥',
    image: foodAssets.milletPorridge,
    description: '慢慢喝完一整碗，心也会慢一点。',
    lovedBy: '小狐狸橘橘',
    origin: '连续几次好好打烊后研究出来',
  },
  {
    key: 'tremella-porridge',
    name: '银耳枸杞粥',
    image: foodAssets.tremellaPorridge,
    description: '温柔一点的早晨限定。',
    lovedBy: '小鸟蓝蓝',
    origin: '熟客带来的家乡做法',
  },
]

export const guests: GuestEntry[] = [
  {
    key: 'cat',
    name: '黑猫阿墨',
    image: animalAssets.cat,
    favorite: '油条',
    visits: 9,
    closeness: '已经会坐在窗边等开门',
    status: '熟客',
    line: '总是第一个来，但只轻轻点头。',
    story: '它今天还是没说很多话，但把豆浆喝得很干净。',
  },
  {
    key: 'rabbit',
    name: '白兔小团',
    image: animalAssets.rabbit,
    favorite: '粥',
    visits: 6,
    closeness: '见面会主动问你昨晚睡得如何',
    status: '常来',
    line: '喜欢慢慢喝完一整碗热粥。',
    story: '它把耳朵搭在碗边，等粥不烫了才开始喝。',
  },
  {
    key: 'raccoon',
    name: '小浣熊灰灰',
    image: animalAssets.raccoon,
    favorite: '豆浆',
    visits: 5,
    closeness: '会把杯子整齐放回柜台',
    status: '渐熟',
    line: '手里总想拿点什么，停下来时反而很乖。',
    story: '它今天没有东张西望，只是安静喝完了豆浆。',
  },
  {
    key: 'bear',
    name: '小熊栗子',
    image: animalAssets.bear,
    favorite: '包子',
    visits: 4,
    closeness: '已经记得自己的小凳子',
    status: '常来',
    line: '抱着热包子时最安心。',
    story: '它把包子捧在手里很久，好像不急着吃。',
  },
  {
    key: 'fox',
    name: '小狐狸橘橘',
    image: animalAssets.fox,
    favorite: '小米粥',
    visits: 3,
    closeness: '开始愿意在门口多坐一会儿',
    status: '新熟',
    line: '看起来很精神，其实也会困。',
    story: '它今天来得很早，只说想喝一点暖的。',
  },
  {
    key: 'sparrow',
    name: '小麻雀啾啾',
    image: animalAssets.sparrow,
    favorite: '银耳枸杞粥',
    visits: 2,
    closeness: '还在熟悉铺子的味道',
    status: '新客',
    line: '小小一只，但很认真地记得路。',
    story: '它站在窗边看了很久，最后还是飞进来了。',
  },
  {
    key: 'bird',
    name: '小鸟蓝蓝',
    image: animalAssets.bird,
    favorite: '豆浆',
    visits: 2,
    closeness: '会在收音机旁边停一会儿',
    status: '新客',
    line: '喜欢安静的早晨声音。',
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
    name: '白面团版',
    note: '更朴素的一团白面。',
    image: spiritAssets.whiteDough,
    src: spiritAssets.whiteDough.src,
    fallbackSrc: spiritAssets.whiteDough.fallbackSrc,
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
    name: '迷茫贝果',
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
  { label: '昨晚又晚了', response: '没关系，铺子今天只是安静一点。我们先把豆浆热上。' },
  { label: '今天有点累', response: '那今天就少做一点，铺子也可以慢慢来。' },
  { label: '今晚想早点关灯', response: '好呀，我们傍晚先把明天的小纸条写好。' },
]

export const messageBoardNotes = [
  '今天的油条很好吃。——阿墨',
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
  return option?.result ?? '说不清'
}

export function createDefaultLogEntries(): LogEntry[] {
  const moods: ShopMood[] = ['平常', '热闹', '平常', '安静', '平常', '热闹', '平常']
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
      shopMood: moods[index] ?? '平常',
      guestCount: guestCounts[index] ?? 6,
      closingNote: notes[index] ?? '平稳收摊',
    }
  })
}
