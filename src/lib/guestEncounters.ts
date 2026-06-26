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

  // ── 精灵客人的来往（文案为占位，待用户定稿）──
  spirit1: [
    {
      zh: '它软软地挪到柜台边，不说话，只是把自己靠得近一点。豆浆放过去，它捧着，看热气慢慢散。',
      en: 'It shuffles softly to the counter, says nothing, just leans a little closer. You set down the soy milk; it cradles the cup, watching the steam drift away.',
    },
    {
      zh: '它来得越来越勤了。每次都坐同一个角落，像在认领一小块属于自己的安静。',
      en: 'It comes more and more often. Always the same corner, as if claiming a small patch of quiet for itself.',
    },
    {
      zh: '有天它终于开口，声音很轻："这里……可以待着吗？"问完又有点不好意思地缩了缩。',
      en: 'One day it finally spoke, very softly: "Can I… stay here?" Then shrank back, a little shy.',
    },
    {
      zh: '现在它进门就熟门熟路地坐下，不必再问。它说在别处它总怕自己太软，在这儿不用。',
      en: 'Now it sits down like it belongs, no need to ask. It says elsewhere it always fears being too soft — here it doesn\'t have to.',
    },
  ],

  spirit2: [
    {
      zh: '它揣着手坐着，半天没动。你递过去一个热包子，它愣了一下，才小声说了句"谢谢"。',
      en: 'It sits with its hands tucked in, still for a while. You hand it a warm bun; it freezes, then murmurs a quiet "thank you."',
    },
    {
      zh: '它开始会主动挑你不忙的时候来，像是算好了不打扰你。',
      en: 'It started timing its visits for when you\'re not busy, as if careful not to be in the way.',
    },
    {
      zh: '有天它破例多说了几句，讲到一半自己先红了脸，把剩下的话又咽了回去。',
      en: 'One day it talked a bit more than usual — blushed halfway through, and swallowed the rest of the words back.',
    },
    {
      zh: '现在它愿意把心里那点甜露出来了。它说藏着太久会发酸，在你这儿，刚好可以慢慢化开。',
      en: 'Now it lets the sweetness inside show. It says hidden too long it turns sour — here, it can slowly melt instead.',
    },
  ],

  spirit3: [
    {
      zh: '它圆滚滚地滚进来，撞到凳子腿也不恼，咧着嘴笑，整个身子轻轻晃。',
      en: 'It rolls in, round and bouncy, unbothered even when it bumps a stool leg — grinning, its whole body wobbling gently.',
    },
    {
      zh: '它记住了你爱听的那档节目，每次都掐着点来，好跟你一起听。',
      en: 'It memorized the radio show you like, showing up right on time each day to listen along with you.',
    },
    {
      zh: '有天你看起来没什么精神，它没说什么，只是滚到你脚边，靠着你晃了一会儿。',
      en: 'One day you looked low. It said nothing, just rolled to your feet and wobbled against you for a while.',
    },
    {
      zh: '现在它一进门就先看你的脸色。它说圆的东西最懂怎么把人撞软一点——它就是来干这个的。',
      en: 'Now it reads your face the moment it enters. It says round things know best how to nudge someone soft — that\'s what it\'s here for.',
    },
  ],

  spiritFamily1_1: [
    {
      zh: '它来得很晚，几乎踩着打烊的点。门快拉下时才慢悠悠晃进来，像是白天另有去处，这是它一天的最后一站。',
      en: 'It comes late, almost on the closing bell. It ambles in just as the shutters are coming down, as if it had somewhere else to be all day, and this is its last stop.',
    },
    {
      zh: '它有自己的一套规矩：先绕铺子走一圈，看看哪儿变了，才挑个角落坐下。',
      en: 'It has its own routine: first a slow lap around the shop to see what\'s changed, then it picks a corner and settles.',
    },
    {
      zh: '有天它难得多留了会儿，含含糊糊说起白天在外面跑的事，没说全，但你听得出它过得不轻松。',
      en: 'One day it lingered, rarely so, and mumbled a bit about its day out and about — not the whole story, but enough to tell its days aren\'t easy.',
    },
    {
      zh: '现在它把这儿当成收尾的地方。忙了一整天，它就来你这儿坐到灯灭，像是给自己的一天，找了个能安心打烊的角落。',
      en: 'Now it treats this as where its day winds down. After a long day, it comes to sit until the lights go out — as if it, too, has found a corner where its own day can safely close.',
    },
  ],
}
