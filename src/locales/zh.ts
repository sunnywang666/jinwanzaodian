/**
 * zh.ts — 中文翻译
 */
export const zh = {
  // ── 通用 ──
  common: {
    continue: '继续',
    back: '返回',
    save: '保存',
    saved: '已保存',
    skip: '跳过',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    reset: '重置',
    nextStep: '下一步',
    backToShop: '返回铺子',
    prevGuest: '上一位',
    nextGuest: '下一位',
  },

  // ── Onboarding 故事 ──
  onboarding: {
    story: {
      beat1: {
        title: '有一家叫「今晚早点」的铺子',
        body: '清晨才开门，只卖早点，夜里跟着店长一起关灯歇业。',
      },
      beat2: {
        title: '它的常客不多，但都很熟',
        body: '橘猫阿橘总是第一个来，坐在门口等开门。白兔小团喜欢慢慢喝完一整碗热粥。精灵在柜台后揉着面，等店长回来。',
      },
      beat3: {
        title: '可是店长不见了',
        body: '铺子空了好些天，客人慢慢少了，精灵也没什么精神了。',
      },
      beat4: {
        title: '精灵说：也许是夜晚把他留住了',
        body: '上一个店长总是睡不好，渐渐地，早上就再也起不来开门了。铺子需要一个能好好休息的人。',
      },
      beat5: {
        title: '它看着你，眼睛亮了一下',
        body: '「你来之前，我想先了解一下你的夜晚。这样我才知道怎么陪你。」',
        cta: '和它聊聊',
      },
    },
    // ── 精灵对话式测试 ──
    quiz: {
      spiritAsk: '{name}想了解你……',
      q1: {
        question: '到了该睡的时候，你最常见的状态是？',
        options: {
          revenge: '今天终于属于我了',
          habit: '再刷一下就睡',
          anxiety: '脑子停不下来',
          work: '活儿还没做完',
        },
      },
      q2: {
        question: '如果有人叫你早点睡，你通常会？',
        options: {
          revenge: '有点烦，不想被管',
          habit: '答应，但手还是停不下来',
          anxiety: '更焦虑',
          work: '觉得我还没资格睡',
        },
      },
      q3: {
        question: '夜里你最常在做什么？',
        options: {
          revenge: '刷手机、看剧、打游戏',
          habit: '也没干什么，就是没放下手机',
          anxiety: '翻来覆去想事情',
          work: '加班或者赶东西',
        },
      },
      q4: {
        question: '你跟早晨的关系是？',
        options: {
          revenge: '闹钟的仇人，能赖就赖',
          habit: '起来了就还好，就是起不来',
          anxiety: '醒得很早，但感觉没休息够',
          work: '有事才起得来，没事就废了',
        },
      },
      q5: {
        question: '你最希望被怎样陪伴？',
        options: {
          revenge: '先让我开心一下',
          habit: '帮我停下来',
          anxiety: '帮我清空脑子',
          work: '帮我把事情放到明天',
        },
      },
    },
    // ── 结果 ──
    result: {
      intro: '它最懂这种夜晚——',
      spiritAppears: '一只面点精灵从柜台后探出来，它将一直陪着你。',
      pickSkin: '给它挑一个外表',
    },
    types: {
      '报复型': '报复型',
      '惯性型': '惯性型',
      '焦虑型': '焦虑型',
      '工作型': '工作型',
      '猫头鹰型': '猫头鹰型',
      '说不清': '说不清',
    },
    typeCopy: {
      '报复型': '你不是不困，只是想把一点属于自己的时间拿回来。',
      '惯性型': '你知道差不多该停了，只是手和眼睛还没一起停下来。',
      '焦虑型': '夜里最吵的不是手机，是脑子里还没放下的事情。',
      '工作型': '你总想把事情做完再休息，可铺子也需要店长先关灯。',
      '猫头鹰型': '你的节奏天生更晚一点，铺子会更柔和地陪你调整。',
      '说不清': '今晚先不用急着定义自己，铺子会慢慢陪你看清节奏。',
    },
    // ── 选皮肤 / 起名 / 关灯时间 ──
    skinSelect: {
      title: '选一个点心形态',
      subtitle: '左右滑动或点击两侧挑选，以后还能解锁更多',
      confirm: '就决定是你了',
    },
    namingTitle: '给它起个名字',
    namingPlaceholder: '阿团',
    nameHint: '先给它起个名字，就能继续啦',
    lightsOff: {
      title: '平时希望几点关灯？',
      subtitle: '这只是参考，铺子不会催你。',
      cta: '开张',
    },
  },

  // ── 设置 ──
  settings: {
    title: '设置',
    lightsOffTime: '默认关灯时间',
    lightsOffDesc: '每天傍晚准备时会用这个时间作为默认值。',
    sleepInsights: {
      title: '睡眠洞察',
      desc: '在清晨和账本里，温柔地告诉你几点放下手机、休息了多久、最近的趋势，并在状态变差时轻声提醒。不想看可以随时关掉。',
    },
    language: '语言',
    languageDesc: '切换界面语言。',
    api: {
      title: '精灵对话 API',
      desc: '铺子内置了精灵的对话服务。如果你有自己的 API，也可以在这里接入。支持 OpenAI 格式的接口（DeepSeek、Moonshot 等都兼容）。',
      urlLabel: 'API 地址（留空用内置服务）',
      keyLabel: 'API Key（留空用内置服务）',
      saveBtn: '保存 API 设置',
      savedCustom: '已切换到自定义 API，下次对话生效。',
      savedDefault: '已恢复使用内置服务。',
    },
    about: {
      title: '关于',
      version: '「今晚早点」v{v}',
      line1: '一家只在你手机里的早点铺。',
      line2: '不是闹钟，不是打卡，不是助眠白噪音。',
      line3: '铺子不会催你睡觉，只是会在你放下手机的时候，安静地陪着你。',
      spiritSays: '{name} 也想说：谢谢你来看铺子。',
      yourType: '你的类型：{type}',
    },
    privacy: {
      title: '数据与隐私',
      desc: '所有数据都保存在你的手机本地，铺子不会上传任何信息。精灵对话通过你配置的 API 发送，不经过其他服务器。',
    },
    reset: {
      title: '重置铺子',
      desc: '清空所有数据，回到开店之前。这个操作无法撤回。',
      btn: '清空所有数据',
      confirmMsg: '确定要清空所有数据吗？铺子会回到最初的样子，所有记录都会消失。',
    },
  },

  // ── 场景文案 ──
  scene: {
    cover: { title: '铺子刚刚开门', body: '柜台后有一点暖光，今天也从这里开始。' },
    busy: { title: '清晨热闹起来了', body: '昨晚睡得早些，今天来吃早点的人也多些。' },
    normal: { title: '平常的一天', body: '没有哪里需要被责怪，铺子稳稳开着。' },
    quiet: { title: '今天安静一点', body: '门照常开着，明天也还在。' },
    daytime: { title: '白天在备菜', body: '你和精灵一起揉面、擦柜台、准备明天。' },
    nap: { title: '午后短短打个盹', body: '这只是铺子里的松弛片刻，不算任务。' },
    evening: { title: '傍晚准备明天', body: '先把关灯时间和心事都写下来。' },
    night: { title: '该关灯歇业了', body: '把铺子收好，再把手机放远一点。' },
    lightsOff: { title: '铺子已经熄灯', body: '灯关了，剩下的夜晚会自己安静下来。' },
  },

  // ── 早晨开门 ──
  morning: {
    greeting: '早安，店长',
    lookAround: '看看铺子',
    lastNight: '昨晚',
    closedRecap: '昨晚 {time} 关的灯，铺子休息得不错。',
    notClosedRecap: '昨晚没来得及打烊，不过没关系。',
    closedComment: '{name}：昨晚辛苦了，今天从容一点。',
    notClosedComment: '{name}：没事，铺子不记仇的。',
    worryReturn: '{name} 轻轻递来昨晚的小纸条',
    worryQuestion: '过了一夜，这件事还压着你吗？',
    released: '放下了',
    carrying: '还在',
    dontLook: '不想看',
    openUp: '开门啦',
    openDesc: '柜台擦好了，豆浆热好了，门口的小灯亮起来了。',
    welcome: '迎客',
    // Beat 0
    shopDark: '铺子还暗着……',
    pullShutter: '拉开卷帘',
    // 奖励
    rewardNewSkin: '精灵学会了{skin}的样子！',
    rewardNewSkinSub: '新的点心形态已解锁，去小屋看看吧。',
    rewardClose: '离{skin}还差 {count} 晚',
    rewardCloseSub: '继续好好关灯，精灵在努力变形呢。',
    rewardTrending: '这几天铺子越来越热闹了',
    rewardTrendingSub: '早睡带来的好精神，客人们都感觉到了。',
    rewardDefault: '又一个好好关灯的夜晚',
    rewardDefaultSub: '每一晚都算数，铺子记着呢。',
    rewardNoClose: '铺子今天照常为你开门',
    rewardNoCloseSub: '没有奖励也没有惩罚，只是陪着。',
    // Midday
    middayGuests: '今天上午来了 {count} 位客人。',
    middayStart: '开始备菜',
    midday: {
      busy: { title: '早点快卖完啦', body: '{name}：今天真热闹！下午咱们一起备菜，试试新配方。' },
      normal: { title: '上午收摊了', body: '{name}：平常的一天也挺好的。下午一起擦擦柜台吧。' },
      quiet: { title: '上午结束了', body: '{name}：今天安静一点，不过门照常开着。下午慢慢来。' },
    },
    // 个性化问候
    greetings: {
      closed: {
        revenge: { line1: '昨晚 {time} 就关了灯，你把时间还给了夜晚。', line2: '{name}：铺子替你守着，你睡得很好。' },
        inertia: { line1: '昨晚 {time} 关的灯，你真的停下来了。', line2: '{name}：手放下了，铺子就安心了。' },
        anxiety: { line1: '昨晚 {time} 关的灯，铺子休息得不错。', line2: '{name}：脑子里的事明天再说，今天先开门。' },
        work: { line1: '昨晚 {time} 就收摊了，做得好。', line2: '{name}：活儿明天还在，但你今天更有精神了。' },
        owl: { line1: '昨晚 {time} 关的灯，节奏慢慢在调。', line2: '{name}：不急，每一步都算数。' },
        unsure: { line1: '昨晚 {time} 关了灯。', line2: '{name}：不管昨晚是什么感觉，今天铺子照常开。' },
      },
      notClosed: {
        revenge: { line1: '昨晚没来得及打烊，夜晚被你多留了一会儿。', line2: '{name}：没关系，灯我一直留着，今天我们再来。' },
        inertia: { line1: '昨晚没关灯，手可能还是没停下来。', line2: '{name}：没事，铺子不记仇，今天还在。' },
        anxiety: { line1: '昨晚铺子没关上，可能脑子里还有事。', line2: '{name}：今天不用急，铺子先替你稳着。' },
        work: { line1: '昨晚没打烊，可能活儿太多了。', line2: '{name}：没关系，今天铺子帮你兜着。' },
        owl: { line1: '昨晚没来得及关灯。', line2: '{name}：你的节奏本来就晚一点，没关系的。' },
        unsure: { line1: '昨晚没有打烊。', line2: '{name}：没事，铺子照常为你开着。' },
      },
    },
  },

  // ── 傍晚 ──
  evening: {
    title: '先把今晚安排轻一点',
    ask: {
      default: '{name} 说：明天阿橘要来吃油条呢，今晚打算几点关灯歇着？',
      revenge: '{name} 说：白天都在忙别人的事吧。先给今晚的自己留一点时间，再定个关灯的点，好吗？',
      inertia: '{name} 说：手机最容易让人忘了时间。先说好今晚几点关灯，到点我提醒你。',
      anxiety: '{name} 说：今晚有什么放不下的，先写下来交给我。然后定一个关灯的点好吗？',
      work: '{name} 说：那件活儿，真的非今晚不可吗？先定个关灯时间，剩下的交给明早的铺子。',
      owl: '{name} 说：我不催你早睡。你明早大概几点起？我帮你倒推一个舒服的关灯点。',
      unsure: '{name} 说：今晚说不清也没关系。先随手定个关灯时间，我陪着你。',
    },
    lightsOffLabel: '今晚关灯时间',
    worryLabel: '今晚放不下的事',
    worryPlaceholder: '想说什么就说吧，我都听着——不用今晚全部解决。',
    spiritReply: '{name}：先把它写进明天的小纸条里，今晚不用一直放在脑子里。',
    method: {
      default: '{name}：先把它写进明天的小纸条，今晚就交给我。',
      revenge: '{name}：今晚别用刷手机补白天了——给自己留 15 分钟做一件真喜欢的小事，比刷一小时更解馋。',
      inertia: '{name}：手机最爱偷走时间。跟自己约个"再看 3 条就停"，看到好的截图存着，明天再看。',
      anxiety: '{name}：脑子转不停时，把事一件件写进上面那个框——写下来的，就不用一直在脑子里循环了。',
      work: '{name}：先问自己一句，这件事明天上午真做不完吗？做不完就列个清单留给明早，那 30 分钟比现在熬两小时值。',
      owl: '{name}：不用逼自己早睡。定个稳定的关灯点，只要明早能睡够，就是好作息。',
      unsure: '{name}：说不清也没关系。睡前记一句"今晚最想放下的是什么"，慢慢就清楚了。',
    },
    saveBtn: '保存今晚安排',
    savedMsg: '已经写进铺子的明日纸条里。',
    backToChat: '回去和 {name} 聊聊 →',
  },

  // ── 打烊 ──
  closing: {
    title: '铺子要关灯歇业了',
    subtitle: '不是"你该睡了"——是你这个店长该收摊了。',
    step1: '关掉柜台小灯',
    step1Desc: '铺子亮了一整天，够了。',
    step2: '拉下小卷帘',
    step2Desc: '明天还会再拉起来的。',
    step3: '精灵回小屋睡',
    step3Desc: '它打了个哈欠，跟你说了声晚安。',
    step4: '铺子睡了',
    step4Desc: '把手机也放下吧，扣过来放远一点。',
    clickHint: '点击完成这一步',
    doneTitle: '铺子睡了',
    doneBody: '{name} 已经回小屋了。\n灯关了，剩下的夜晚会自己安静下来。',
    worryNote: '{name}：今晚的小纸条已经收好了，明天再看。',
    putDown: '把手机也放下吧，扣过来放远一点。',
    readyCta: '我准备放下手机了',
    alreadyCta: '已记录，回到铺子',
    alreadyNote: '今晚已经记录为熄灯状态。',
  },

  // ── 精灵小屋 ──
  spiritHut: {
    title: '精灵小屋',
    desc: '它只是一个漂浮的小圆面团，可以隔空揉面，没有手脚。',
    goodNights: '累计早睡 {count} 晚',
    tabSkins: '换装',
    tabAchievements: '成就',
    lockedHint: '再早睡 {count} 晚',
    lockedSoon: '满 {count} 晚 · 待上新',
    skinSectionTitle: '点心形态',
    skinNote: '点心形态靠累计早睡的夜晚慢慢解锁——只累计、断了不清零、越往后越珍贵。',
    achUnlocked: '已点亮',
    achOverall: '点亮进度',
    achGroupSleep: '早睡之路',
    achGroupCollect: '铺子收集',
    achGroupRest: '安睡',
    skins: {
      base: '白面团', xiaolongbao: '小笼包', bagel: '贝果', croissant: '可颂',
      donut: '甜甜圈', waffle: '华夫饼', matcha: '抹茶生乳包', baozi: '包子', mochi: '麻薯',
    },
  },

  // ── 成就 ──
  achievements: {
    firstNight: { title: '第一个好觉', desc: '第一次熄屏早睡' },
    weekEarly: { title: '攒够一周', desc: '累计早睡 7 个夜晚' },
    monthEarly: { title: '攒够一月', desc: '累计早睡 30 个夜晚' },
    hundredNights: { title: '百夜安眠', desc: '累计早睡 100 个夜晚' },
    firstGuest: { title: '第一位客人', desc: '认识铺子的第一位客人' },
    allGuests: { title: '高朋满座', desc: '认识所有的客人' },
    firstDish: { title: '第一道手艺', desc: '做出第一道早点' },
    fullMenu: { title: '菜单写满', desc: '学会铺子所有早点' },
    collector: { title: '集齐形态', desc: '解锁所有点心形态' },
    soundSleep: { title: '睡得真香', desc: '一觉睡满 8 小时' },
    earlyDown: { title: '早早收摊', desc: '在 23:00 前放下手机' },
  },

  // ── 收音机 ──
  radio: {
    title: '收音机',
    timerLabel: '定时关闭',
    timerNone: '不限',
    breathingTitle: '呼吸引导',
    breathingActive: '进行中',
    breathingInactive: '点击开启',
    inhale: '吸气',
    hold: '屏住',
    exhale: '呼气',
    breathingCycle: '4 秒吸 · 4 秒屏 · 6 秒呼',
    minutes: '{n} 分钟',
    ch: {
      rain: { name: '雨声', desc: '窗外淅淅沥沥' },
      wind: { name: '微风', desc: '树叶沙沙地响' },
      cafe: { name: '咖啡馆', desc: '远处有人小声说话' },
      fireplace: { name: '壁炉', desc: '柴火噼啪作响' },
    },
  },

  // ── 营业账本 ──
  logbook: {
    title: '营业账本',
    openTime: '开门',
    closeTime: '关灯',
    status: '状态',
    moodBusy: '热闹',
    moodNormal: '平常',
    moodQuiet: '安静',
    guestCount: '客人',
    guestUnit: '位',
    worryLabel: '小纸条',
    worryReleased: '已放下',
    worryCarrying: '还在',
    worryPending: '未回看',
  },

  // ── 睡眠洞察 ──
  sleep: {
    // 清晨开门里的小结
    morningSummary: '昨晚你 {time} 放下手机，休息了约 {dur}。',
    settleNote: '打烊后又过了约 {min} 分钟才真的放下，没关系，慢慢来。',
    nightWakeNote: '夜里你回来看了 {count} 次，又睡回去了，挺好。',
    // 账本里的洞察卡
    insightTitle: '睡眠洞察',
    avgPutDown: '平均放下手机',
    avgRest: '平均休息',
    consistency: '入睡规律',
    consistencyValue: '±{min} 分',
    nightWakesLabel: '夜里拿手机',
    nightWakesValue: '{count} 次',
    trendMoreRest: '最近比之前多休息约 {min} 分钟',
    trendLessRest: '最近比之前少休息约 {min} 分钟',
    trendLater: '放下手机的时间，最近一点点变晚了',
    trendEarlier: '放下手机的时间，最近越来越早了',
    trendSteady: '节奏挺稳的',
    basedOnNote: '只用"App 在不在前台"估算，不监测你的睡眠。',
    needMore: '再记录几晚，睡眠洞察会更准。',
    // 预警（精灵口吻，温柔不指责）
    warnTitle: '铺子想轻轻跟你说句话',
    warn: {
      restShort: '{name}：这几晚你平均只休息了 {dur}，铺子有点心疼。今晚要不要早一点放下手机？',
      gettingLater: '{name}：最近放下手机的时间一点点变晚了。我不催你，只是想让你知道我看见了。',
      restless: '{name}：你夜里好像总会醒来看几次手机。要不要试试把它放到够不着的地方？',
      settleSlow: '{name}：打烊之后，你还要再刷好一会儿才真的放下。傍晚那张小纸条，也许能帮你早点松手。',
    },
  },

  // ── 留言板 ──
  messageBoard: {
    title: '留言板',
  },

  // ── 确认视图 ──
  confirm: {
    guestBook: '要打开客人图鉴吗？',
    recipeBook: '要打开菜品图鉴吗？',
    yes: '要',
    no: '不要',
  },

  // ── 菜谱本 ──
  recipeBook: {
    title: '菜谱本',
    guest: '客人',
    origin: '来源',
  },

  // ── App 顶栏 ──
  app: {
    resetBtn: '重置',
    resetConfirm: '要清空开店流程和本地演示记录吗？',
    returnLong: '哎，你回来啦。铺子一直开着呢。',
    returnShort: '欢迎回来，铺子还在。',
  },

  // ── 精灵对话 UI ──
  spiritChat: {
    apiError: '精灵暂时连不上，先用离线模式陪你',
    inputPlaceholder: '想说点什么……',
    send: '发送',
  },

  // ── Home ──
  home: {
    shopName: '今晚早点',
    auto: '自动',
    manual: '手动',
    debug: 'DEBUG',
    sceneDebug: '场景调试',
    confirmReopen: '铺子已经打烊了，确定要重新开门吗？',
    audioPlaying: '♫ {channel}',
  },
} as const
