import { guestAssets, spiritAssets } from './assets'
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
  image: string
  unlocked: boolean
  description: string
  lovedBy: string
  origin: string
}

export interface GuestEntry {
  key: keyof typeof guestAssets
  name: string
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
  unlocked: boolean
  src: string
  fallbackSrc?: string
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
  焦虑型: '夜里最吵的不是手机，是脑子里还没有放下的事情。',
  工作型: '你总想把事情做完再休息，可铺子也需要店长先关灯。',
  猫头鹰型: '你的节奏天生更晚一点，铺子会用更柔和的方式陪你调整。',
  说不清: '今晚没有标准答案，先让铺子陪你慢慢看清自己的节奏。',
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
  cover: {
    title: '铺子刚刚开门',
    body: '柜台后有一点暖光，今天也从这里开始。',
    mood: '平常',
  },
  busy: {
    title: '清晨热闹起来了',
    body: '昨晚歇得早些，今天来吃早点的人也多些。',
    mood: '热闹',
  },
  normal: {
    title: '平常的一天',
    body: '没有哪里需要被责怪，铺子稳稳开着。',
    mood: '平常',
  },
  quiet: {
    title: '今天安静一点',
    body: '门照常开着，明天也还在。',
    mood: '安静',
  },
  daytime: {
    title: '白天在备菜',
    body: '你和精灵一起揉面、擦柜台、准备明天。',
    mood: '平常',
  },
  nap: {
    title: '午后短短打个盹',
    body: '这只是铺子里的松弛片刻，不算任务。',
    mood: '平常',
  },
  evening: {
    title: '傍晚准备明天',
    body: '先把关灯时间和心事都写下来。',
    mood: '平常',
  },
  night: {
    title: '该关灯歇业了',
    body: '把铺子收好，再把手机放远一点。',
    mood: '安静',
  },
  lightsOff: {
    title: '铺子已经熄灯',
    body: '灯关了，剩下的夜晚会自己安静下来。',
    mood: '安静',
  },
}

export const dishes: Dish[] = [
  {
    key: 'baozi',
    name: '包子',
    image: '/assets/dish-baozi.png',
    unlocked: true,
    description: '开张就会做的招牌早点，蒸笼一掀就有热气。',
    lovedBy: '小熊栗子',
    origin: '开张时就写在菜单板上。',
  },
  {
    key: 'soy',
    name: '豆浆',
    image: '/assets/dish-soy-milk.png',
    unlocked: true,
    description: '慢慢磨出来的一杯温热，适合清晨第一口。',
    lovedBy: '浣熊灰灰',
    origin: '和精灵白天试了两次比例。',
  },
  {
    key: 'youtiao',
    name: '油条',
    image: '/assets/dish-youtiao.png',
    unlocked: true,
    description: '外面酥一点，里面软一点，阿墨每次都会先看它。',
    lovedBy: '黑猫阿墨',
    origin: '清晨热闹起来后解锁。',
  },
  {
    key: 'porridge',
    name: '粥',
    image: '/assets/dish-porridge.png',
    unlocked: true,
    description: '小火慢慢熬着，像铺子的底气。',
    lovedBy: '白兔小团',
    origin: '给安静的早晨留的一锅温热。',
  },
  {
    key: 'croissant',
    name: '可颂',
    image: '/assets/dish-croissant.png',
    unlocked: false,
    description: '还没出现在铺子里，但菜单上已经留了空位。',
    lovedBy: '猫头鹰夜灯',
    origin: '等更多熄灯夜晚累积后解锁。',
  },
  {
    key: 'donut',
    name: '甜甜圈',
    image: '/assets/dish-donut.png',
    unlocked: false,
    description: '也许某位熟客以后会带来一张配方。',
    lovedBy: '还不知道',
    origin: '也许会由熟客教给你。',
  },
]

export const guests: GuestEntry[] = [
  {
    key: 'cat',
    name: '黑猫阿墨',
    favorite: '油条',
    visits: 9,
    closeness: '已经会坐在窗边等开门',
    status: '熟客',
    line: '总是第一个来，但只轻轻点头。',
    story: '它今天还是没说很多话，但把豆浆喝得很干净。离开前，它在门口停了一下，像是在确认明天还会开门。',
  },
  {
    key: 'rabbit',
    name: '白兔小团',
    favorite: '粥',
    visits: 6,
    closeness: '见面会主动问你昨晚睡得如何',
    status: '常来',
    line: '喜欢慢慢喝完一整碗热粥。',
    story: '它把碗捧得很近，坐在最靠近暖灯的位置。今天它说，粥里有一点像早晨的味道。',
  },
  {
    key: 'raccoon',
    name: '浣熊灰灰',
    favorite: '豆浆',
    visits: 4,
    closeness: '开始愿意把小故事讲长一点',
    status: '渐熟',
    line: '每次都说只坐一会儿，最后总会多留五分钟。',
    story: '它把联络簿翻到自己的那一页，看了很久，然后小声说下次也许可以教你一杯新的豆浆。',
  },
  {
    key: 'bear',
    name: '小熊栗子',
    favorite: '包子',
    visits: 3,
    closeness: '刚刚熟起来，已经记得你的招牌',
    status: '新熟',
    line: '看起来慢，其实总能很准时地出现。',
    story: '它今天把包子分成两半慢慢吃。临走前，它认真看了看招牌，说这个名字很好记。',
  },
  {
    key: 'owl',
    name: '猫头鹰夜灯',
    favorite: '可颂',
    visits: 2,
    closeness: '还是新客，但已经记住铺子的暖灯',
    status: '新客',
    line: '来得不算早，却总会安静地坐到最后。',
    story: '它来得比其他客人晚一点，坐下时没有打扰谁。它说，安静的铺子也很好。',
  },
]

export const spiritOptions: SpiritOption[] = [
  {
    form: 'base',
    name: '白面团',
    note: '最初的小圆面团，软软地漂在柜台边。',
    unlocked: true,
    ...spiritAssets.base,
  },
  {
    form: 'xiaolongbao',
    name: '小笼包',
    note: '第一层点心外表，还是同一双豆豆眼。',
    unlocked: true,
    ...spiritAssets.xiaolongbao,
  },
  {
    form: 'sleep',
    name: '打盹形态',
    note: '预留给午后和熄灯后的睡觉状态素材。',
    unlocked: false,
    ...spiritAssets.sleep,
  },
  {
    form: 'croissant',
    name: '可颂形态',
    note: '预留给后续里程碑皮肤。',
    unlocked: false,
    ...spiritAssets.croissant,
  },
  {
    form: 'donut',
    name: '甜甜圈形态',
    note: '预留给后续里程碑皮肤。',
    unlocked: false,
    ...spiritAssets.donut,
  },
]

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'intro-1',
    speaker: 'spirit',
    text: '店长，今天铺子开着。我在柜台后面，先陪你待一会儿。',
  },
  {
    id: 'intro-2',
    speaker: 'user',
    text: '我只是来看看铺子。',
  },
  {
    id: 'intro-3',
    speaker: 'spirit',
    text: '看看就好。今天不用急着把所有事都整理清楚。',
  },
]

export const quickReplies: Array<{ label: string; response: string }> = [
  {
    label: '昨晚又晚了',
    response: '那今天铺子就慢一点。不是坏掉了，只是灯光轻一点，客人少一点，明天还会开门。',
  },
  {
    label: '今天有点累',
    response: '累的时候先别给自己加一堆道理。我们把柜台擦一小块，就算今天做过一件事了。',
  },
  {
    label: '今晚想早点关灯',
    response: '那先把关灯时间定下来。到点以后，铺子收摊，我回小屋，你把手机放远一点。',
  },
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
