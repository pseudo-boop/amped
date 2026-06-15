// ╔══════════════════════════════════════════════╗
// ║        YOUR PERSONALISATION FILE             ║
// ║  Edit only this file for all customisation   ║
// ╚══════════════════════════════════════════════╝

const CONFIG = {

  // Sidebar header title
  siteTitle: "Memories",

  // Hero section
  heroTitle: "Your Life Soundtrack",
  heroSubtitle: "precious moments",
  heroCount: "1,234",

  // Cover photo shown in hero (put file in assets/images/)
  heroCover: "assets/images/US/best.jpeg",

  // Your names in the chat
  yourName: "You",
  yourInitial: "Y",
  herName: "Her",
  herInitial: "H",

  // ── CHAT: GitHub Gist ──────────────────────────
  // 1. https://gist.github.com → New secret Gist
  //    filename: chat.json   content: []
  // 2. https://github.com/settings/tokens → New classic token
  //    tick "gist" scope → copy token
  // 3. Paste both values below:
  gistId:      "debbb6c9c185ac410863299fb3ca78b0",
  githubToken: "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",

  // ── FAVOURITES: Spotify links ──────────────────
  spotifyLinks: [
    {
      name:        "Songs we will play in our hall /Car Drive/ airbnb stays",
      description: "lol i tricked you in making a playlist",
      emoji:       "🎵",
      url:         "https://open.spotify.com/playlist/7jCLXvOvEfpeduoawpo8g7?si=VSSn2DsBQ0eI0Ng0bEhvSw",
      type:        "Playlist",
    },
    {
      name:        "Imposition Riff",
      description: "Can I impose my favourite, non musical, no dimag songs on u?",
      emoji:       "🌸",
      url:         "https://open.spotify.com/playlist/27Pfkyq620Sywei6X0HKUK?si=lMmTOoMfThaaeeM_mbl95g",
      type:        "Playlist - you are going to get triggered with the mixed nature of this",
    },
    {
      name:        "Mix of what you like and what i like about you",
      description: "ew cringe name",
      emoji:       "🐒",
      url:         "https://open.spotify.com/playlist/3yQr4ZKUWFVBRITAgqYYAl?si=CftiR4XLQRyfz-RI-CwJNw",
      type:        "Playlist · 31 songs",
    },
    {
      name:        "Late Nights",
      description: "that 10 hour playlist lol",
      emoji:       "🌙",
      url:         "https://open.spotify.com/playlist/337NaUTePIUGpmf10bDUSm?si=ie8aA-OlQ2eKDxOdPMNltw",
      type:        "Playlist",
    },
  ],

  // ── PLACES: add images to assets/images/ ───────
  places: [
    {
      name:  "we are walking",
      date:  "always",
      note:  "we will walk in italy someday",
      images: ["assets/images/w_1.jpg", "assets/images/w_2.jpg"],
    },
    {
      name:  "us",
      note:  "can we please talk it out and try to be on the same page forevaaa??",
      images: ["assets/images/US/wow11.jpg", "assets/images/US/wow1.jpg","assets/images/US/wow2.jpeg", "assets/images/US/wow3.jpeg", "assets/images/US/wow4.jpg"],
    },
    {
      name:  "shaadi album bruh",
      note:  "we r gonna do court marriage so this is the album ppl be seeing.",
      images: ["assets/images/US/wow5.jpg", "assets/images/US/wow6.jpg","assets/images/US/wow7.jpg", "assets/images/US/wow8.jpg", "assets/images/US/wow9.jpg", "assets/images/US/wow10.jpg"],
    },
    // {
    //   name:  "The Park",
    //   date:  "March 2024",
    //   note:  "Add a little memory here…",
    //   image: "assets/images/place3.jpg",
    // },
    // {
    //   name:  "The Drive",
    //   date:  "April 2024",
    //   note:  "Add a little memory here…",
    //   image: "assets/images/place4.jpg",
    // },
  ],

  // // ── FOOD: put gif at assets/gifs/food.gif ──────
  // foodGif: "assets/gifs/food.gif",
  // foodQuote: "Every bite is a memory we made together.",
  // foodMemories: [
  //   { emoji: "🍜", name: "That ramen place",   where: "Add the place name" },
  //   { emoji: "🍕", name: "Late night pizza",   where: "Add the place name" },
  //   { emoji: "🧁", name: "The little bakery",  where: "Add the place name" },
  //   { emoji: "☕", name: "Morning coffee",      where: "Add the place name" },
  // ],
  // Timeline entries
timelineEvents: [
  { date: "August 2022", title: "The First Walk", note: "One where we questioned ourselves", emoji: "🚶" },
  { date: "December 2022", title: "The first of many long distancing", note: "u crai crai, huehuehe", emoji: "☕" },
  { date: "February 2023", title: "Scare-do", note: "It was a out of nowhere (engagement)", emoji: "💍" },
  { date: "May 2023", title: "Khan-ed", note: "completed our first course on DSA,(it is a big task, trust me))", emoji: "⏩" },
  { date: "August 2023", title: "um um fighty", note: "well. we are always debating (duh)", emoji: "😪" },
  { date: "Jan 2024", title: "yay. we working", note: "actually no. scratch that, too sad it was", emoji: "⏩" },
  { date: "August 2024", title: "Intern-ed", note: "yay NOW, we figured out", emoji: "✨" },
  { date: "December 2024", title: "Bad bad semester", note: "Bad Bad fight, very pregnant woman attitude we both have", emoji: "🤰" },
  { date: "April 2025", title: "Gradu-ATE-d", note: "it hurt, it hurts, and then it did hurt to be away", emoji: "🛫"  },
  { date: "August 8th 2025", title: "Reached the USA", note: "and we are happy till we are not", emoji: "🐒" },
  { date: "December 2025", title: "Reached THE IIT G", note: "and we are happy till we are not", emoji: "🐒" },
  { date: "February 2026", title: "Hiccup", note: "Hiccuped", emoji: "👈" },
  { date: "March", title: "and WE are back", note: "okay google, play 'You're all I want' by CAS", emoji: "🚭" },
],

// Bingo squares — 24 items (center is auto FREE)
bingoSquares: [
  "garam pastry-ed together", "shared a toothbrush", "stayed up to talk even if it hurt our head", "took silly photos",
  "went on a trippy trip", "cried and then cried", "watched a rom com", "thought about getting a pet",
  "cooked together", "got lost in the middle of jatni", "thought about u in the middle of something", "visited a new country",
  "celebrated a birthday with just us", "car buying occasion", "found a new song for 'US'", "sent a voice note with a song badly sung",
  "did something scary (lol)", "had the best BIRYANI ever?", "made a spontaneous plan (and only that plan worked ever)",
  "danced in the middle of night (?)", "stayed in all day, at the same place", "argued and fought and then gave up",
  "met each other's family", "created a whatsapp group for us",
],

};
