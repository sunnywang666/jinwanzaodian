/**
 * guestEncounters.ts — v6.6
 *
 * 「来往」4拍叙事数据。
 * 每只客人 4 拍，按 familiarityLevel 0-3 解锁。
 * 中英双语。
 */

export interface EncounterBeat {
  zh: string
  en: string
}

export type GuestEncounters = Record<string, EncounterBeat[]>

export const guestEncounters: GuestEncounters = {
  cat: [
    {
      zh: '它总是第一个到。门没开，就蹲在台阶上，尾巴圈着脚，像在替你守着第一缕暖光。',
      en: 'It\'s always the first to arrive. Before the shop opens, it sits on the step, tail curled around its paws, as if guarding the first ray of warm light for you.',
    },
    {
      zh: '你拉开卷帘时它已经在了。油条端过去，它没急着吃，先用尾巴尖在你脚边碰了一下，这是它最接近道谢的样子。',
      en: 'It\'s already there when you pull up the shutters. You bring the youtiao over; it doesn\'t rush to eat, just brushes its tail tip against your foot — its closest thing to a thank-you.',
    },
    {
      zh: '有天你起晚了，它没走，还蹲在台阶上等。见你来了也不恼，只是站起来抖抖毛，像在说"知道你会来的"。',
      en: 'One day you overslept. It didn\'t leave — still sitting on the step. When you finally showed up, it just stood, shook its fur, as if to say "I knew you\'d come."',
    },
    {
      zh: '它开始挑你状态不好的早晨多坐一会儿。它说不出什么，但你慢吞吞备菜的时候，它就安安静静卧在柜台边陪着。它准时，好像也是在等你好好地出现。',
      en: 'It started staying longer on mornings when you looked off. It can\'t say much, but when you\'re sluggishly prepping, it just lies quietly by the counter. Its punctuality — maybe it\'s been waiting for you to show up well.',
    },
  ],

  raccoon: [
    {
      zh: '它捧着豆浆杯，爪子一直在杯壁上轻轻搓，停不下来。手里得攥着点什么，它才安心。',
      en: 'It holds the soy milk cup, paws constantly rubbing the sides, unable to stop. It needs something in its hands to feel at ease.',
    },
    {
      zh: '喝完了，它会把空杯子端端正正摆回柜台边，摆好才肯走。',
      en: 'When finished, it places the empty cup neatly back by the counter. Won\'t leave until it\'s perfectly straight.',
    },
    {
      zh: '有天它破天荒空着手坐了一小会儿，什么都没攥。它自己愣了一下，好像发现这样也没什么不好。',
      en: 'One day, for the first time, it sat with empty hands for a moment — holding nothing. It blinked, surprised, as if realizing that was okay too.',
    },
    {
      zh: '现在它来，越来越能空着手待着了。爪子搭在膝上，肩膀松松地垂着。把手里的东西放下，原来没那么难——这件事你俩好像在一起学会的。',
      en: 'Now when it comes, it can sit with empty hands more and more. Paws on its lap, shoulders relaxed. Letting go of what\'s in your hands isn\'t so hard after all — something you two seem to be learning together.',
    },
  ],

  fox: [
    {
      zh: '它来得很早，毛梳得整整齐齐，看起来精精神神。可你一转身去拿碗，它就对着窗户打了个大大的哈欠。',
      en: 'It arrives early, fur neatly groomed, looking full of energy. But the moment you turn to grab a bowl, it lets out a huge yawn at the window.',
    },
    {
      zh: '它开始愿意进门多坐一会儿，不再扒着门框。那碗温粥喝得很慢，眼睛眯成一条缝。',
      en: 'It starts lingering inside, no longer clinging to the doorframe. It drinks the warm porridge slowly, eyes narrowed to slits.',
    },
    {
      zh: '有天它没再装精神，趴在垫子上小睡了一会儿，醒来有点不好意思，假装是在看窗外。',
      en: 'One day it stopped pretending to be energetic — dozed off on the cushion for a bit. Woke up a little embarrassed, pretending it was looking out the window.',
    },
    {
      zh: '现在它会在你面前坦坦荡荡地打哈欠，也不藏了。它说在这儿不用撑着，这屋子里，困就是困，没人笑它。',
      en: 'Now it yawns openly in front of you, no longer hiding. It says here you don\'t have to push through — in this shop, tired is just tired, nobody laughs.',
    },
  ],

  rabbit: [
    {
      zh: '它从不催，也不怕等。一碗粥要等到不烫了才肯喝，两只耳朵搭在碗沿上，小口小口地。',
      en: 'It never rushes, never minds waiting. Won\'t touch the porridge until it\'s cooled, ears draped over the bowl\'s edge, sipping in tiny mouthfuls.',
    },
    {
      zh: '它进门会先看一眼你的脸色，再决定要不要多待一会儿。',
      en: 'When it enters, it reads your face first, then decides whether to stay a bit longer.',
    },
    {
      zh: '它开始会主动问你："昨晚睡得还好吗？"问完也不追着要答案，就是想让你知道有人惦记。',
      en: 'It started asking on its own: "Did you sleep okay last night?" Doesn\'t press for an answer — just wants you to know someone\'s thinking of you.',
    },
    {
      zh: '你看起来累的早晨，它会多陪你坐很久，什么也不说，临走前轻轻讲一句"不急的"。它好像把"慢慢来"这三个字，一点点还给了你。',
      en: 'On mornings you look tired, it sits with you for a long time, saying nothing. Before leaving, a quiet "no rush." It seems to be returning the words "take your time" back to you, bit by bit.',
    },
  ],

  bear: [
    {
      zh: '包子还冒着热气，它先把脸贴上去，鼓着腮帮子捧着，捧很久，舍不得咬第一口。',
      en: 'The bun is still steaming. It presses its face against it first, cheeks puffed, holding it for a long time, reluctant to take the first bite.',
    },
    {
      zh: '它已经记住了哪张凳子最稳，每次都往那儿坐，像认了自己的位置。',
      en: 'It\'s memorized which stool is sturdiest, heading for the same one each time, like it\'s claimed its spot.',
    },
    {
      zh: '它学会把包子掰成两半，吃一半，留一半在手里焐着，好让这点暖多待一会儿。',
      en: 'It learned to break the bun in half — eat one half, keep the other in its paws to warm them, making the warmth last a little longer.',
    },
    {
      zh: '有天它吃完没立刻走，在垫子上坐到太阳照进来。它说不太清楚，但这里有点像它想象中"家"该有的样子。',
      en: 'One day it didn\'t leave right after eating, sitting on the cushion until sunlight poured in. It can\'t quite explain, but this place feels a bit like what it imagined "home" should be.',
    },
  ],

  sparrow: [
    {
      zh: '它在窗外的电线上站了好久，歪着头看了又看，才扑棱着飞进来。落在最靠门的位置，随时能走。',
      en: 'It stood on the wire outside for ages, tilting its head back and forth, before finally fluttering in. Landed by the door — ready to leave anytime.',
    },
    {
      zh: '茶叶蛋比它还大，它绕着啄半天，啄一口就抬头看你一眼，确认你没有别的意思。',
      en: 'The tea egg is bigger than it is. It pecks around it for ages, looking up at you after each peck, making sure you don\'t mean anything by it.',
    },
    {
      zh: '它开始往里挪了一点点，不再死守着门边。偶尔还会在你手边短短停一下，又飞开。',
      en: 'It started inching inside, no longer glued to the doorway. Sometimes it pauses briefly by your hand, then flits away again.',
    },
    {
      zh: '有天它直接落在了柜台上你的手边，不再挑那个能立刻逃走的位置。它认得这里了：在这儿，不用随时准备飞走。',
      en: 'One day it landed right next to your hand on the counter, no longer choosing the escape-ready spot. It knows this place now: here, you don\'t have to be ready to fly away.',
    },
  ],

  bird: [
    {
      zh: '它好像不是为早点来的。落在收音机旁边，半天没动，那杯豆浆只浅浅啜两口，大半时间都偏着头在听。',
      en: 'It doesn\'t seem to come for the food. It perches by the radio, still for ages, barely sipping its soy milk, spending most of the time with its head tilted, listening.',
    },
    {
      zh: '它开始跟着收音机哼一点听不清的调子，可你一转头看它，它就立刻停下来。',
      en: 'It started humming faintly along with the radio — but the moment you turn to look, it stops immediately.',
    },
    {
      zh: '有个特别安静的清晨，它破天荒哼出了完整的一小段。哼完自己愣了一下，像很久没这样过了。',
      en: 'On one especially quiet morning, it hummed a complete little melody for the first time. Paused afterward, surprised at itself, as if it hadn\'t done that in a long while.',
    },
    {
      zh: '现在你还没开收音机，它就先落在那个位置等着。这屋子的安静，是它在别处找不到的。它需要这里的理由，和你需要这个铺子的理由，大概是同一个。',
      en: 'Now before you even turn on the radio, it\'s already perched in its spot, waiting. The quiet of this shop — it can\'t find that anywhere else. Its reason for needing this place is probably the same as yours.',
    },
  ],
}
