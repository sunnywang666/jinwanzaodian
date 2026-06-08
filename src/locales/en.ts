/**
 * en.ts — English translations
 */
export const en = {
  common: {
    continue: 'Continue',
    back: 'Back',
    save: 'Save',
    saved: 'Saved',
    skip: 'Skip',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    reset: 'Reset',
    nextStep: 'Next',
    backToShop: 'Back to shop',
    prevGuest: 'Previous',
    nextGuest: 'Next',
  },

  onboarding: {
    story: {
      beat1: {
        title: 'There\'s a little shop called "Tonight, Sleep Early"',
        body: 'It only opens at dawn, serves breakfast, and closes when the shopkeeper turns off the lights at night.',
      },
      beat2: {
        title: 'Its regulars are few, but they all know each other',
        body: 'Ginger the cat is always first, waiting by the door. Little Tuan the rabbit likes to finish a whole bowl of warm porridge. The spirit kneads dough behind the counter, waiting for the shopkeeper.',
      },
      beat3: {
        title: 'But the shopkeeper disappeared',
        body: 'The shop has been empty for days. Fewer guests come by. The spirit lost its spark.',
      },
      beat4: {
        title: 'The spirit said: maybe the night kept them',
        body: 'The last shopkeeper couldn\'t sleep well, and eventually couldn\'t get up to open the shop anymore. The shop needs someone who can rest properly.',
      },
      beat5: {
        title: 'It looks at you, eyes brightening',
        body: '"Before you start, I\'d like to understand your nights. That way I\'ll know how to keep you company."',
        cta: 'Chat with it',
      },
    },
    quiz: {
      spiritAsk: '{name} wants to understand you…',
      q1: {
        question: 'When it\'s time to sleep, what\'s your usual state?',
        options: {
          revenge: 'Finally, time that\'s mine',
          habit: 'Just one more scroll, then sleep',
          anxiety: 'My mind won\'t stop',
          work: 'I haven\'t finished my work yet',
        },
      },
      q2: {
        question: 'If someone tells you to sleep earlier, you usually…',
        options: {
          revenge: 'Feel annoyed — don\'t manage me',
          habit: 'Agree, but can\'t stop scrolling',
          anxiety: 'Feel even more anxious',
          work: 'Feel like I haven\'t earned sleep yet',
        },
      },
      q3: {
        question: 'What do you usually do at night?',
        options: {
          revenge: 'Phone, shows, games',
          habit: 'Nothing much, just can\'t put the phone down',
          anxiety: 'Toss and turn, thinking',
          work: 'Overtime or catching up on tasks',
        },
      },
      q4: {
        question: 'Your relationship with mornings?',
        options: {
          revenge: 'Enemy of alarms — snooze forever',
          habit: 'Fine once I\'m up, just can\'t get up',
          anxiety: 'Wake early but feel unrested',
          work: 'Only get up when there\'s a reason to',
        },
      },
      q5: {
        question: 'How would you like to be accompanied?',
        options: {
          revenge: 'Let me enjoy myself first',
          habit: 'Help me stop',
          anxiety: 'Help me clear my head',
          work: 'Help me leave it for tomorrow',
        },
      },
    },
    result: {
      intro: 'It knows this kind of night —',
      spiritAppears: 'A little dough spirit peeks out from behind the counter. It will always be with you.',
      pickSkin: 'Pick an appearance for it',
    },
    types: {
      '报复型': 'Revenge',
      '惯性型': 'Inertia',
      '焦虑型': 'Anxiety',
      '工作型': 'Workaholic',
      '猫头鹰型': 'Night Owl',
      '说不清': 'Not Sure',
    },
    typeCopy: {
      '报复型': 'You\'re not sleepless — you just want to reclaim a bit of time that\'s yours.',
      '惯性型': 'You know it\'s time to stop, but your hands and eyes haven\'t caught up yet.',
      '焦虑型': 'The loudest thing at night isn\'t your phone — it\'s the thoughts that won\'t settle.',
      '工作型': 'You always want to finish everything before resting, but the shop needs its keeper to close first.',
      '猫头鹰型': 'Your rhythm naturally runs later. The shop will gently keep you company as you adjust.',
      '说不清': 'No need to define tonight. The shop will slowly help you find your rhythm.',
    },
    skinSelect: {
      title: 'Choose a pastry form',
      subtitle: 'Swipe or tap to pick — you can unlock more later',
      confirm: 'This is the one',
    },
    namingTitle: 'Give it a name',
    namingPlaceholder: 'Tuanzi',
    lightsOff: {
      title: 'When do you usually want lights off?',
      subtitle: 'Just a reference — the shop won\'t rush you.',
      cta: 'Open shop',
    },
  },

  settings: {
    title: 'Settings',
    lightsOffTime: 'Default lights-off time',
    lightsOffDesc: 'Used as the default during evening preparation.',
    language: 'Language',
    languageDesc: 'Switch interface language.',
    api: {
      title: 'Spirit Chat API',
      desc: 'The shop has a built-in conversation service. You can also connect your own API here. Supports OpenAI-format APIs (DeepSeek, Moonshot, etc.).',
      urlLabel: 'API URL (leave empty for built-in)',
      keyLabel: 'API Key (leave empty for built-in)',
      saveBtn: 'Save API settings',
      savedCustom: 'Switched to custom API. Takes effect next conversation.',
      savedDefault: 'Restored to built-in service.',
    },
    about: {
      title: 'About',
      version: '"Tonight, Sleep Early" v6.2',
      line1: 'A breakfast shop that lives in your phone.',
      line2: 'Not an alarm. Not a tracker. Not a white noise machine.',
      line3: 'The shop won\'t tell you to sleep — it just quietly keeps you company when you put your phone down.',
      spiritSays: '{name} also wants to say: thank you for visiting the shop.',
      yourType: 'Your type: {type}',
    },
    privacy: {
      title: 'Data & Privacy',
      desc: 'All data is stored locally on your device. The shop doesn\'t upload anything. Spirit conversations go through your configured API only.',
    },
    reset: {
      title: 'Reset shop',
      desc: 'Clear all data and start over. This cannot be undone.',
      btn: 'Clear all data',
      confirmMsg: 'Are you sure? The shop will return to its original state and all records will be lost.',
    },
  },

  scene: {
    cover: { title: 'The shop just opened', body: 'A warm glow behind the counter. Another day begins here.' },
    busy: { title: 'A busy morning', body: 'Slept earlier last night — more guests came for breakfast today.' },
    normal: { title: 'An ordinary day', body: 'Nothing to blame. The shop is steady.' },
    quiet: { title: 'A quiet day', body: 'The door stays open. Tomorrow will come.' },
    daytime: { title: 'Prepping during the day', body: 'You and the spirit knead dough, wipe counters, prepare for tomorrow.' },
    nap: { title: 'A short afternoon nap', body: 'Just a relaxed moment in the shop — not a task.' },
    evening: { title: 'Evening preparation', body: 'Write down the lights-off time and any worries.' },
    night: { title: 'Time to close up', body: 'Tidy the shop, put the phone away.' },
    lightsOff: { title: 'Lights are off', body: 'Lights out. The rest of the night will settle on its own.' },
  },

  morning: {
    greeting: 'Good morning, shopkeeper',
    lookAround: 'Look around the shop',
    lastNight: 'Last night',
    closedRecap: 'Lights went off at {time} last night. The shop rested well.',
    notClosedRecap: 'Didn\'t close up last night — but that\'s okay.',
    closedComment: '{name}: Good job last night. Take it easy today.',
    notClosedComment: '{name}: No worries. The shop doesn\'t hold grudges.',
    worryReturn: '{name} gently hands back last night\'s note',
    worryQuestion: 'After a night\'s sleep, is this still weighing on you?',
    released: 'Let it go',
    carrying: 'Still here',
    dontLook: 'Skip',
    openUp: 'Opening up!',
    openDesc: 'Counter is clean, soy milk is warm, the little light by the door is on.',
    welcome: 'Welcome guests',
  },

  evening: {
    title: 'Let\'s make tonight lighter',
    spiritAsk: '{name} says: Ginger is coming for youtiao tomorrow — what time shall we turn off the lights tonight?',
    lightsOffLabel: 'Lights-off time tonight',
    worryLabel: 'Something on your mind tonight',
    worryPlaceholder: 'Just write it down. You don\'t have to solve it tonight.',
    spiritReply: '{name}: Let\'s put it on tomorrow\'s note. You don\'t have to carry it in your head tonight.',
    saveBtn: 'Save tonight\'s plan',
    savedMsg: 'Written into the shop\'s tomorrow note.',
    backToChat: 'Chat with {name} →',
  },

  closing: {
    title: 'Time to close the shop',
    subtitle: 'Not "you should sleep" — it\'s that you, the shopkeeper, should close up.',
    step1: 'Turn off the counter light',
    step1Desc: 'The shop has been lit all day. That\'s enough.',
    step2: 'Pull down the shutters',
    step2Desc: 'They\'ll go back up tomorrow.',
    step3: 'Spirit goes to its hut',
    step3Desc: 'It yawns, says goodnight.',
    step4: 'The shop sleeps',
    step4Desc: 'Put your phone down too. Face it down, put it away.',
    clickHint: 'Tap to complete this step',
    doneTitle: 'The shop sleeps',
    doneBody: '{name} has gone back to its hut.\nLights off. The rest of the night will settle on its own.',
    worryNote: '{name}: Tonight\'s note is safely tucked away. We\'ll look at it tomorrow.',
    putDown: 'Put your phone down too. Face it down, put it away.',
    readyCta: 'I\'m ready to put my phone down',
    alreadyCta: 'Recorded. Back to shop',
    alreadyNote: 'Tonight has been recorded as lights-off.',
  },

  spiritHut: {
    title: 'Spirit\'s Hut',
    desc: 'It\'s just a floating little dough ball — no hands, no feet, but it can knead dough from a distance.',
    goodNights: '{count} good nights so far',
  },

  radio: {
    title: 'Radio',
    timerLabel: 'Sleep timer',
    timerNone: 'None',
    breathingTitle: 'Breathing guide',
    breathingActive: 'Active',
    breathingInactive: 'Tap to start',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    breathingCycle: '4s in · 4s hold · 6s out',
  },

  logbook: {
    title: 'Logbook',
    openTime: 'Opened',
    closeTime: 'Closed',
    status: 'Status',
    guestCount: 'Guests',
    guestUnit: '',
    worryLabel: 'Note',
    worryReleased: 'Let go',
    worryCarrying: 'Still here',
    worryPending: 'Not reviewed',
  },

  messageBoard: {
    title: 'Message Board',
  },

  home: {
    shopName: 'Tonight, Sleep Early',
    auto: 'Auto',
    manual: 'Manual',
    debug: 'DEBUG',
    sceneDebug: 'Scene debug',
    confirmReopen: 'The shop is already closed. Reopen?',
    audioPlaying: '♫ {channel}',
  },
} as const
