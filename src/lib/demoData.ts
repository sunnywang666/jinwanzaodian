import { guestAssets, spiritAssets } from './assets'
import type { DemoScene, LogEntry, NightType, ShopMood, SpiritForm } from './storage'

export interface Dish {
  name: string
  unlocked: boolean
  progressNote: string
  origin: string
}

export interface GuestEntry {
  key: keyof typeof guestAssets
  name: string
  favorite: string
  visits: number
  closeness: string
  line: string
}

export interface SpiritOption {
  form: SpiritForm
  name: string
  note: string
  unlocked: boolean
  src: string
}

export const nightTypeOptions: NightType[] = [
  '报复型',
  '惯性型',
  '焦虑型',
  '工作型',
  '猫头鹰型',
  '说不清',
]

export const demoSceneOptions: Array<{ key: DemoScene; label: string }> = [
  { key: 'busy', label: '热闹' },
  { key: 'normal', label: '平常' },
  { key: 'quiet', label: '安静' },
  { key: 'daytime', label: '备菜' },
  { key: 'nap', label: '打盹' },
  { key: 'evening', label: '傍晚' },
  { key: 'night', label: '打烊' },
  { key: 'lightsOff', label: '熄灯' },
]

export const sceneCopy: Record<DemoScene, { title: string; body: string; mood: ShopMood }> = {
  cover: {
    title: '铺子刚刚翻开门帘',
    body: '今晚早点先用现有主视觉站住气质。等后续分时段场景图补齐后，这里会跟着现实节奏慢慢活起来。',
    mood: '平常',
  },
  busy: {
    title: '清晨热闹起来了',
    body: '你昨晚歇得早些，今天门口来得早的客人也多些。铺子亮堂，但没有催促感。',
    mood: '热闹',
  },
  normal: {
    title: '铺子是平常的样子',
    body: '没有特别要紧的好，也没有哪里需要被责怪。只是把今天稳稳地过下去。',
    mood: '平常',
  },
  quiet: {
    title: '今天安静一点',
    body: '偶尔晚睡，铺子就轻一点、慢一点。门照常开，明天也还在，不会因为一晚失手变冷清。',
    mood: '安静',
  },
  daytime: {
    title: '白天在备菜打理',
    body: '早高峰过后，你和精灵一起择菜、揉面、擦柜台，把明天想做的手艺一点点备出来。',
    mood: '平常',
  },
  nap: {
    title: '午后短短打个盹',
    body: '这只是铺子里的松弛片刻，不是任务，也没有奖励。醒来以后，日子继续往前。',
    mood: '平常',
  },
  evening: {
    title: '傍晚开始准备明天',
    body: '现在还清醒，适合把关灯时间先定下来。放不下的事先记进纸条，别一直放在脑子里。',
    mood: '平常',
  },
  night: {
    title: '该关灯歇业了',
    body: '主语一直是铺子，不是说教。你不是被催着睡觉，是在把这家只做早点的小店好好收起来。',
    mood: '安静',
  },
  lightsOff: {
    title: '铺子已经熄灯',
    body: '灯关了，卷帘也落下来了。剩下的只是把手机放远一点，让这一晚自己安静下去。',
    mood: '安静',
  },
}

export const dishes: Dish[] = [
  { name: '包子', unlocked: true, progressNote: '每天都能稳稳出锅。', origin: '开张就会做的招牌手艺。' },
  { name: '豆浆', unlocked: true, progressNote: '越做越顺手，早晨最先卖完。', origin: '和精灵白天试了两次比例。' },
  { name: '油条', unlocked: true, progressNote: '阿墨每次来都先看它。', origin: '清晨热闹起来后解锁。' },
  { name: '粥', unlocked: true, progressNote: '慢火熬着，像铺子的底气。', origin: '给安静的早晨留的一锅温热。' },
  { name: '可颂', unlocked: false, progressNote: '还没出现在你的铺子里。', origin: '等更多熄灯夜晚累积后解锁。' },
  { name: '甜甜圈', unlocked: false, progressNote: '还没出现在你的铺子里。', origin: '也许会由熟客带来一张新配方。' },
]

export const guests: GuestEntry[] = [
  { key: 'cat', name: '黑猫阿墨', favorite: '油条', visits: 9, closeness: '已经会坐在窗边等开门', line: '总是第一个来，但只轻轻点头。' },
  { key: 'rabbit', name: '白兔小团', favorite: '粥', visits: 6, closeness: '见面会主动问你昨晚睡得如何', line: '喜欢慢慢喝完一整碗热粥。' },
  { key: 'raccoon', name: '浣熊灰灰', favorite: '豆浆', visits: 4, closeness: '开始愿意把小故事讲长一点', line: '每次都说只坐一会儿，最后总会多留五分钟。' },
  { key: 'bear', name: '小熊栗子', favorite: '包子', visits: 3, closeness: '刚刚熟起来，已经记得你的招牌', line: '看起来慢，其实总能很准时地出现。' },
  { key: 'owl', name: '猫头鹰夜灯', favorite: '可颂', visits: 2, closeness: '还是新客，但已经记住铺子的暖灯', line: '来得不算早，却总会安静地坐到最后。' },
]

export const spiritOptions: SpiritOption[] = [
  {
    form: 'base',
    name: '白面团',
    note: '最初的小团白面，软乎乎地跟着你一起看铺子。',
    unlocked: true,
    src: spiritAssets.base,
  },
  {
    form: 'xiaolongbao',
    name: '小笼包',
    note: '已经有了第一层点心外表，豆豆眼还是那双豆豆眼。',
    unlocked: true,
    src: spiritAssets.xiaolongbao,
  },
  {
    form: 'sleep',
    name: '打盹形态',
    note: '预留给午后和熄灯后的睡觉状态素材。',
    unlocked: false,
    src: spiritAssets.sleep,
  },
  {
    form: 'croissant',
    name: '可颂形态',
    note: '预留给后续里程碑皮肤。',
    unlocked: false,
    src: spiritAssets.croissant,
  },
  {
    form: 'donut',
    name: '甜甜圈形态',
    note: '预留给后续里程碑皮肤。',
    unlocked: false,
    src: spiritAssets.donut,
  },
]

function formatDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function createDefaultLogEntries(): LogEntry[] {
  const moods: ShopMood[] = ['平常', '热闹', '平常', '安静', '平常', '热闹', '平常']
  const closes = ['23:10', '22:50', '23:20', '23:45', '23:05', '22:40', '23:15']
  const opens = ['07:20', '06:55', '07:10', '07:45', '07:18', '06:50', '07:05']
  const guests = [6, 8, 7, 4, 6, 9, 7]
  const notes = ['按时打烊', '熄灯后很快安静下来', '写了纸条再去睡', '稍微晚了些，但还是关了灯', '陪到打烊', '早早就把灯关掉了', '平稳收摊']

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - index)

    return {
      date: formatDate(date),
      openTime: opens[index] ?? '07:12',
      closeTime: closes[index] ?? '23:10',
      shopMood: moods[index] ?? '平常',
      guestCount: guests[index] ?? 6,
      closingNote: notes[index] ?? '平稳收摊',
    }
  })
}
