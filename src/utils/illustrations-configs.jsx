// ── 120 theme configurations ─────────────────────────────────────────────────
// Each entry: { tpl, id, bg1,bg2, mid1,mid2, fg1,fg2, acc,
//              charm('coin'|'star'|'chest'), cx,cy, text, lg1,lg2, seed }

import {
  TplVault, TplFair, TplStage, TplArena, TplCapitol,
  TplNature, TplFestive, TplDesk, TplAnimal, TplAbsurd,
} from './illustrations-templates';

const C = [
  // ── Money / Finance ──────────────────────────────────────────────────────
  // t001 A Milli A Milli A Milli — gold vault, coin rain
  { tpl:TplVault,  id:'t001', bg1:'#1A0900',bg2:'#3D1E00', mid1:'#8B6400',mid2:'#C89000', fg1:'#FFD700',fg2:'#FFC200', acc:'#FFE55C', charm:'coin',  cx:300,cy:36, text:'A MILLI',          lg1:'#FFD700',lg2:'#FF8800', seed:1  },
  // t002 Debt Breaker — red flames, chain breaking
  { tpl:TplVault,  id:'t002', bg1:'#1A0000',bg2:'#440000', mid1:'#880000',mid2:'#CC2200', fg1:'#FF4444',fg2:'#FF9900', acc:'#FFCC00', charm:'star',  cx:305,cy:35, text:'DEBT BREAKER',     lg1:'#FF4444',lg2:'#FF9900', seed:2  },
  // t003 Bob Dole's Bank Roll — navy, colonial
  { tpl:TplVault,  id:'t003', bg1:'#000033',bg2:'#000066', mid1:'#001A88',mid2:'#3355CC', fg1:'#AABBFF',fg2:'#FFD700', acc:'#FF5555', charm:'coin',  cx:48, cy:36, text:"DOLE'S BANK ROLL", lg1:'#6688FF',lg2:'#FFD700', seed:3  },
  // t004 401-Ka-Ching — green bar chart
  { tpl:TplVault,  id:'t004', bg1:'#001400',bg2:'#003300', mid1:'#004400',mid2:'#008800', fg1:'#44FF88',fg2:'#FFD700', acc:'#00FF66', charm:'star',  cx:50, cy:35, text:'401-KA-CHING',     lg1:'#44FF88',lg2:'#FFD700', seed:4  },
  // t005 Hedge Fund Honeypot — amber honeycomb
  { tpl:TplVault,  id:'t005', bg1:'#1A0800',bg2:'#3D1A00', mid1:'#8B5000',mid2:'#CC8800', fg1:'#FFB830',fg2:'#FF7700', acc:'#FFE055', charm:'chest', cx:48, cy:62, text:'HONEYPOT',          lg1:'#FFB830',lg2:'#FF7700', seed:5  },
  // t006 The Bailout — silver steel
  { tpl:TplVault,  id:'t006', bg1:'#111122',bg2:'#1E1E2E', mid1:'#444455',mid2:'#666677', fg1:'#C8C8D8',fg2:'#AAAACC', acc:'#EEEEFF', charm:'coin',  cx:300,cy:35, text:'THE BAILOUT',      lg1:'#CCCCDD',lg2:'#888899', seed:6  },
  // t007 Too Big To Fail — royal blue columns
  { tpl:TplVault,  id:'t007', bg1:'#000022',bg2:'#000044', mid1:'#0A1A66',mid2:'#2244BB', fg1:'#88AAFF',fg2:'#FFD700', acc:'#AACCFF', charm:'star',  cx:305,cy:36, text:'TOO BIG TO FAIL',  lg1:'#88AAFF',lg2:'#FFD700', seed:7  },
  // t008 Bull Run Bonanza — deep green, charging
  { tpl:TplVault,  id:'t008', bg1:'#001800',bg2:'#004400', mid1:'#005500',mid2:'#009900', fg1:'#44FF66',fg2:'#FFD700', acc:'#00FF66', charm:'coin',  cx:48, cy:62, text:'BULL RUN',          lg1:'#44FF66',lg2:'#AAFF00', seed:8  },
  // t009 Bear Trap Bucks — rust red
  { tpl:TplVault,  id:'t009', bg1:'#1A0500',bg2:'#440D00', mid1:'#771500',mid2:'#BB3300', fg1:'#FF7744',fg2:'#FFD700', acc:'#FF4444', charm:'star',  cx:48, cy:35, text:'BEAR TRAP',         lg1:'#FF7744',lg2:'#FFAA00', seed:9  },
  // t010 Quantitative Easing — industrial grey press
  { tpl:TplVault,  id:'t010', bg1:'#0D0D1A',bg2:'#1A1A2E', mid1:'#333344',mid2:'#555566', fg1:'#CCCCDD',fg2:'#AAAACC', acc:'#DDDDEE', charm:'coin',  cx:300,cy:35, text:'QE INFINITY',      lg1:'#BBBBCC',lg2:'#888899', seed:10 },
  // t011 Crypto Comeback — space / neon orange
  { tpl:TplVault,  id:'t011', bg1:'#0A0015',bg2:'#15002A', mid1:'#330066',mid2:'#5500AA', fg1:'#FF8800',fg2:'#FFCC00', acc:'#FF6600', charm:'star',  cx:305,cy:36, text:'CRYPTO ₿',          lg1:'#FF8800',lg2:'#FFCC00', seed:11 },
  // t012 Wall Street Windfall — midnight navy, brass
  { tpl:TplVault,  id:'t012', bg1:'#000A1A',bg2:'#001033', mid1:'#001A55',mid2:'#003399', fg1:'#FFD700',fg2:'#FFAA00', acc:'#5599FF', charm:'coin',  cx:48, cy:62, text:'WALL ST WINDFALL',  lg1:'#FFD700',lg2:'#FFAA00', seed:12 },
  // t013 Tax Refund Turbo — bright green, rocket
  { tpl:TplVault,  id:'t013', bg1:'#001800',bg2:'#003800', mid1:'#004400',mid2:'#007700', fg1:'#44FF88',fg2:'#CCFF00', acc:'#00FF66', charm:'star',  cx:300,cy:35, text:'TAX REFUND',        lg1:'#44FF88',lg2:'#CCFF00', seed:13 },
  // t014 Compound Interest — deep teal, money tree
  { tpl:TplVault,  id:'t014', bg1:'#001515',bg2:'#003333', mid1:'#005555',mid2:'#008888', fg1:'#44DDDD',fg2:'#00FFEE', acc:'#00FFEE', charm:'chest', cx:48, cy:62, text:'COMPOUND',          lg1:'#44DDDD',lg2:'#00BBAA', seed:14 },
  // t015 The Inheritance — gothic purple mansion
  { tpl:TplVault,  id:'t015', bg1:'#0D0022',bg2:'#1A0033', mid1:'#3A006E',mid2:'#6622AA', fg1:'#CC88FF',fg2:'#DDAAFF', acc:'#CC88FF', charm:'chest', cx:300,cy:62, text:'THE INHERITANCE',  lg1:'#BB66FF',lg2:'#6622AA', seed:15 },

  // ── Food ─────────────────────────────────────────────────────────────────
  // t016 Breakfast of Champions — sunrise orange, pancakes
  { tpl:TplFair,   id:'t016', bg1:'#331400',bg2:'#FF9900', mid1:'#CC5500',mid2:'#FF7700', fg1:'#FFD700',fg2:'#FF8800', acc:'#FFEE55', charm:'coin',  cx:298,cy:62, text:'BREAKFAST',         lg1:'#FFD700',lg2:'#FF6600', seed:16 },
  // t017 Bacon & Eggs Benedict — copper sizzle
  { tpl:TplFair,   id:'t017', bg1:'#1A0A00',bg2:'#CC6600', mid1:'#8B4500',mid2:'#CC6600', fg1:'#FFD700',fg2:'#FF6622', acc:'#FFCC55', charm:'star',  cx:52, cy:62, text:'BACON & EGGS',      lg1:'#FFD700',lg2:'#CC5500', seed:17 },
  // t018 Golden Nuggets — county fair gold
  { tpl:TplFair,   id:'t018', bg1:'#1A0800',bg2:'#CC8800', mid1:'#884400',mid2:'#CC6600', fg1:'#FFD700',fg2:'#FFAA00', acc:'#FFE066', charm:'coin',  cx:298,cy:62, text:'GOLDEN NUGGETS',    lg1:'#FFD700',lg2:'#CC8800', seed:18 },
  // t019 Doughnut Dollars — bubblegum pink
  { tpl:TplFair,   id:'t019', bg1:'#1A0011',bg2:'#FF66BB', mid1:'#CC1155',mid2:'#FF44AA', fg1:'#FFCCEE',fg2:'#FF88CC', acc:'#FF88FF', charm:'coin',  cx:52, cy:62, text:'DOUGHNUT $',        lg1:'#FFAADD',lg2:'#CC1155', seed:19 },
  // t020 Pizza Party Payday — marinara red
  { tpl:TplFair,   id:'t020', bg1:'#1A0000',bg2:'#CC2200', mid1:'#881100',mid2:'#CC3300', fg1:'#FFDD88',fg2:'#FFAA44', acc:'#FF6622', charm:'star',  cx:298,cy:36, text:'PIZZA PARTY',       lg1:'#FFAA44',lg2:'#FF4422', seed:20 },
  // t021 Taco Tuesday Treasure — fiesta orange
  { tpl:TplFair,   id:'t021', bg1:'#1A0800',bg2:'#FF7700', mid1:'#CC4400',mid2:'#FF6600', fg1:'#FFEE44',fg2:'#88DD44', acc:'#FF8833', charm:'chest', cx:298,cy:62, text:'TACO TUESDAY',      lg1:'#FFEE44',lg2:'#FF6600', seed:21 },
  // t022 Loaded Baked Potato — golden field
  { tpl:TplFair,   id:'t022', bg1:'#1A1000',bg2:'#CC9900', mid1:'#885500',mid2:'#BB8800', fg1:'#FFD700',fg2:'#FFEEAA', acc:'#FFE055', charm:'coin',  cx:52, cy:62, text:'LOADED SPUD',       lg1:'#FFD700',lg2:'#CC9900', seed:22 },
  // t023 Biscuits and Gravy Train — biscuit brown copper
  { tpl:TplFair,   id:'t023', bg1:'#1A0A00',bg2:'#996633', mid1:'#775533',mid2:'#AA7744', fg1:'#FFDDAA',fg2:'#CC8844', acc:'#FFB866', charm:'star',  cx:298,cy:62, text:'GRAVY TRAIN',       lg1:'#FFDDAA',lg2:'#CC7733', seed:23 },
  // t024 Deep Fried Fortune — carnival gold night
  { tpl:TplFair,   id:'t024', bg1:'#0A0500',bg2:'#884400', mid1:'#553300',mid2:'#997722', fg1:'#FFD700',fg2:'#FFAA00', acc:'#FF8800', charm:'coin',  cx:52, cy:62, text:'DEEP FRIED',        lg1:'#FFD700',lg2:'#FF6600', seed:24 },
  // t025 Lobster Lottery — ocean crimson
  { tpl:TplFair,   id:'t025', bg1:'#001515',bg2:'#881122', mid1:'#004444',mid2:'#CC1133', fg1:'#FF4455',fg2:'#FFAAAA', acc:'#FF2244', charm:'chest', cx:298,cy:62, text:'LOBSTER',           lg1:'#FF4455',lg2:'#CC0033', seed:25 },
  // t026 Truffle Shuffle — forest purple
  { tpl:TplFair,   id:'t026', bg1:'#0D0022',bg2:'#442255', mid1:'#220033',mid2:'#774466', fg1:'#BB66FF',fg2:'#DDAAFF', acc:'#CC88FF', charm:'chest', cx:52, cy:62, text:'TRUFFLE SHUFFLE',   lg1:'#BB66FF',lg2:'#6622AA', seed:26 },
  // t027 Wagyu Wallet — maroon Japanese
  { tpl:TplFair,   id:'t027', bg1:'#1A0009',bg2:'#881133', mid1:'#660022',mid2:'#AA2244', fg1:'#FFAACC',fg2:'#FF6699', acc:'#FF3377', charm:'coin',  cx:298,cy:62, text:'WAGYU WALLET',      lg1:'#FFAACC',lg2:'#CC1144', seed:27 },
  // t028 Caviar Dreams — abyss teal pearl
  { tpl:TplFair,   id:'t028', bg1:'#001010',bg2:'#002222', mid1:'#004444',mid2:'#006666', fg1:'#44DDDD',fg2:'#AAFFEE', acc:'#00FFEE', charm:'coin',  cx:52, cy:62, text:'CAVIAR DREAMS',     lg1:'#44DDDD',lg2:'#00BBAA', seed:28 },
  // t029 Ice Cream Inheritance — soda fountain pink
  { tpl:TplFair,   id:'t029', bg1:'#1A0011',bg2:'#FF99CC', mid1:'#CC4488',mid2:'#FF77BB', fg1:'#FFCCEE',fg2:'#AAFFDD', acc:'#FF88CC', charm:'star',  cx:298,cy:36, text:'ICE CREAM',         lg1:'#FFCCEE',lg2:'#FF44AA', seed:29 },
  // t030 Nacho Average Jackpot — nacho orange green
  { tpl:TplFair,   id:'t030', bg1:'#1A0800',bg2:'#FF8800', mid1:'#CC5500',mid2:'#FFAA00', fg1:'#FFDD44',fg2:'#88DD44', acc:'#FFCC00', charm:'coin',  cx:52, cy:62, text:'NACHO AVERAGE',     lg1:'#FFDD44',lg2:'#FF6600', seed:30 },

  // ── Pop Culture ───────────────────────────────────────────────────────────
  // t031 Mo Money Mo Problems — gold record
  { tpl:TplStage,  id:'t031', bg1:'#0A0A00',bg2:'#222200', mid1:'#554400',mid2:'#888800', fg1:'#FFD700',fg2:'#FFAA00', acc:'#FFE055', charm:'coin',  cx:298,cy:36, text:'MO MONEY',          lg1:'#FFD700',lg2:'#AA8800', seed:31 },
  // t032 Show Me The Money — Hollywood curtain green
  { tpl:TplStage,  id:'t032', bg1:'#001400',bg2:'#003300', mid1:'#550000',mid2:'#880000', fg1:'#44FF88',fg2:'#FFD700', acc:'#00FF66', charm:'star',  cx:52, cy:36, text:'SHOW ME THE $',     lg1:'#44FF88',lg2:'#FFD700', seed:32 },
  // t033 Get Rich or Scratch Tryin' — silver urban stage
  { tpl:TplStage,  id:'t033', bg1:'#0D0D1A',bg2:'#1A1A2E', mid1:'#333344',mid2:'#555566', fg1:'#CCCCDD',fg2:'#AAAACC', acc:'#DDDDEE', charm:'coin',  cx:300,cy:36, text:'GET RICH',          lg1:'#CCCCDD',lg2:'#888899', seed:33 },
  // t034 Breaking Bank — blue crystal desert
  { tpl:TplStage,  id:'t034', bg1:'#000022',bg2:'#001133', mid1:'#003366',mid2:'#0055AA', fg1:'#88CCFF',fg2:'#44DDCC', acc:'#88CCFF', charm:'star',  cx:52, cy:36, text:'BREAKING BANK',     lg1:'#88CCFF',lg2:'#00AADD', seed:34 },
  // t035 Scratch Empire — royal purple throne
  { tpl:TplStage,  id:'t035', bg1:'#0D0022',bg2:'#1A0033', mid1:'#3A006E',mid2:'#6622AA', fg1:'#CC88FF',fg2:'#FFD700', acc:'#CC88FF', charm:'chest', cx:298,cy:62, text:'SCRATCH EMPIRE',    lg1:'#CC88FF',lg2:'#FFD700', seed:35 },
  // t036 Money Heist Mania — vault heist red
  { tpl:TplStage,  id:'t036', bg1:'#1A0000',bg2:'#440000', mid1:'#880000',mid2:'#CC1100', fg1:'#FF4444',fg2:'#FFD700', acc:'#FF2200', charm:'chest', cx:52, cy:62, text:'MONEY HEIST',       lg1:'#FF4444',lg2:'#CC0000', seed:36 },
  // t037 Succession Stakes — power navy mahogany
  { tpl:TplStage,  id:'t037', bg1:'#000A1A',bg2:'#001133', mid1:'#331100',mid2:'#553300', fg1:'#FFD700',fg2:'#CC9900', acc:'#5599FF', charm:'coin',  cx:298,cy:36, text:'SUCCESSION',        lg1:'#FFD700',lg2:'#AA8800', seed:37 },
  // t038 Suits and Stacks — charcoal silver briefcase
  { tpl:TplStage,  id:'t038', bg1:'#111111',bg2:'#222222', mid1:'#444444',mid2:'#666666', fg1:'#DDDDDD',fg2:'#AAAAAA', acc:'#FFFFFF', charm:'coin',  cx:52, cy:36, text:'SUITS & STACKS',    lg1:'#DDDDDD',lg2:'#888888', seed:38 },
  // t039 Ozark Odds — lake teal rust
  { tpl:TplStage,  id:'t039', bg1:'#001515',bg2:'#002828', mid1:'#553300',mid2:'#885544', fg1:'#44DDCC',fg2:'#FFAA77', acc:'#00FFEE', charm:'star',  cx:298,cy:36, text:'OZARK ODDS',        lg1:'#44DDCC',lg2:'#FFAA44', seed:39 },
  // t040 Wolf of Scratch Street — midnight gold stage
  { tpl:TplStage,  id:'t040', bg1:'#0A0800',bg2:'#1A1400', mid1:'#554400',mid2:'#887700', fg1:'#FFD700',fg2:'#FFAA00', acc:'#FFE055', charm:'coin',  cx:52, cy:62, text:'WOLF OF SCRATCH',   lg1:'#FFD700',lg2:'#CC8800', seed:40 },
  // t041 Billions Bonanza — chess navy ivory
  { tpl:TplStage,  id:'t041', bg1:'#000A1A',bg2:'#001A44', mid1:'#112255',mid2:'#223388', fg1:'#EEEEFF',fg2:'#FFD700', acc:'#8899FF', charm:'star',  cx:298,cy:36, text:'BILLIONS',          lg1:'#EEEEFF',lg2:'#8899FF', seed:41 },
  // t042 Squid Game Scratch — concrete green
  { tpl:TplStage,  id:'t042', bg1:'#001800',bg2:'#003300', mid1:'#334433',mid2:'#445544', fg1:'#44FF88',fg2:'#FF4477', acc:'#00FF88', charm:'coin',  cx:52, cy:62, text:'SQUID SCRATCH',     lg1:'#44FF88',lg2:'#00BB55', seed:42 },
  // t043 Seinfeld's Kramer Kash — olive NYC warm
  { tpl:TplStage,  id:'t043', bg1:'#101A00',bg2:'#203300', mid1:'#334400',mid2:'#556600', fg1:'#CCFF88',fg2:'#FFDD44', acc:'#AADD00', charm:'star',  cx:298,cy:36, text:"KRAMER KASH",       lg1:'#CCFF88',lg2:'#AADD00', seed:43 },
  // t044 Jurassic Jackpot — jungle amber fossil
  { tpl:TplStage,  id:'t044', bg1:'#001400',bg2:'#003300', mid1:'#334400',mid2:'#885500', fg1:'#AADD44',fg2:'#FFCC44', acc:'#88AA00', charm:'chest', cx:52, cy:62, text:'JURASSIC JACKPOT',  lg1:'#AADD44',lg2:'#FFCC44', seed:44 },

  // ── Sports ────────────────────────────────────────────────────────────────
  // t045 Sports Bettor's Revenge — arena green gold
  { tpl:TplArena,  id:'t045', bg1:'#001800',bg2:'#003300', mid1:'#225522',mid2:'#448844', fg1:'#44FF88',fg2:'#FFD700', acc:'#00FF66', charm:'coin',  cx:52, cy:38, text:"BETTOR'S REVENGE",  lg1:'#44FF88',lg2:'#FFD700', seed:45 },
  // t046 Hail Mary Money — touchdown red
  { tpl:TplArena,  id:'t046', bg1:'#1A0000',bg2:'#440000', mid1:'#663300',mid2:'#994400', fg1:'#FF8844',fg2:'#FFD700', acc:'#FF4444', charm:'star',  cx:298,cy:38, text:'HAIL MARY',         lg1:'#FF8844',lg2:'#FFD700', seed:46 },
  // t047 Slam Dunk Dollars — basketball orange
  { tpl:TplArena,  id:'t047', bg1:'#1A0800',bg2:'#442200', mid1:'#773300',mid2:'#CC5500', fg1:'#FF8833',fg2:'#FFD700', acc:'#FF7722', charm:'coin',  cx:52, cy:62, text:'SLAM DUNK',         lg1:'#FF8833',lg2:'#FFCC44', seed:47 },
  // t048 Home Run Hundreds — Americana blue chalk
  { tpl:TplArena,  id:'t048', bg1:'#000022',bg2:'#001166', mid1:'#223388',mid2:'#4466BB', fg1:'#AABBFF',fg2:'#FFD700', acc:'#FFFFFF', charm:'star',  cx:298,cy:38, text:'HOME RUN',          lg1:'#AABBFF',lg2:'#FFD700', seed:48 },
  // t049 Hole in One — course green flag white
  { tpl:TplArena,  id:'t049', bg1:'#001400',bg2:'#004400', mid1:'#335533',mid2:'#558855', fg1:'#88CC88',fg2:'#FFFFFF', acc:'#44FF88', charm:'chest', cx:52, cy:62, text:'HOLE IN ONE',       lg1:'#88CC88',lg2:'#44AA55', seed:49 },
  // t050 Champion's Purse — Olympic gold ceremony
  { tpl:TplArena,  id:'t050', bg1:'#1A1000',bg2:'#443300', mid1:'#886600',mid2:'#CC9900', fg1:'#FFD700',fg2:'#FFEEAA', acc:'#FFE055', charm:'coin',  cx:298,cy:62, text:"CHAMPION'S PURSE",  lg1:'#FFD700',lg2:'#CC9900', seed:50 },
  // t051 Fantasy Fortune — wizard purple blue
  { tpl:TplArena,  id:'t051', bg1:'#0D0022',bg2:'#1A0033', mid1:'#330066',mid2:'#5522AA', fg1:'#BB88FF',fg2:'#FFD700', acc:'#AA66FF', charm:'star',  cx:52, cy:38, text:'FANTASY FORTUNE',   lg1:'#BB88FF',lg2:'#FFD700', seed:51 },
  // t052 Hat Trick Riches — ice blue white
  { tpl:TplArena,  id:'t052', bg1:'#000022',bg2:'#001155', mid1:'#224488',mid2:'#4488BB', fg1:'#AADDFF',fg2:'#FFFFFF', acc:'#88CCFF', charm:'coin',  cx:298,cy:38, text:'HAT TRICK',         lg1:'#AADDFF',lg2:'#4499CC', seed:52 },
  // t053 Grand Slam Greenbacks — Wimbledon grass
  { tpl:TplArena,  id:'t053', bg1:'#001800',bg2:'#004400', mid1:'#335533',mid2:'#66AA66', fg1:'#88DDAA',fg2:'#FFFFFF', acc:'#44FF88', charm:'star',  cx:52, cy:38, text:'GRAND SLAM',        lg1:'#88DDAA',lg2:'#44AA66', seed:53 },
  // t054 The Podium Payout — Olympic gold red
  { tpl:TplArena,  id:'t054', bg1:'#1A0A00',bg2:'#443300', mid1:'#883300',mid2:'#BB4400', fg1:'#FFD700',fg2:'#FFEEAA', acc:'#FF5533', charm:'coin',  cx:298,cy:62, text:'THE PODIUM',        lg1:'#FFD700',lg2:'#FF5533', seed:54 },
  // t055 Pit Stop Payday — racing red checkered
  { tpl:TplArena,  id:'t055', bg1:'#1A0000',bg2:'#440000', mid1:'#111111',mid2:'#333333', fg1:'#FF4444',fg2:'#FFFFFF', acc:'#FF2222', charm:'star',  cx:52, cy:38, text:'PIT STOP',          lg1:'#FF4444',lg2:'#CC0000', seed:55 },
  // t056 Knockout Cash — fighting crimson gold
  { tpl:TplArena,  id:'t056', bg1:'#1A000D',bg2:'#440011', mid1:'#771122',mid2:'#AA1133', fg1:'#FF4466',fg2:'#FFD700', acc:'#FF2244', charm:'coin',  cx:298,cy:62, text:'KNOCKOUT',          lg1:'#FF4466',lg2:'#FFD700', seed:56 },

  // ── Political / Historical ────────────────────────────────────────────────
  // t057 Executive Order Rich — Oval Office blue parchment
  { tpl:TplCapitol,id:'t057', bg1:'#000022',bg2:'#001044', mid1:'#001A66',mid2:'#002288', fg1:'#AABBFF',fg2:'#FFD700', acc:'#FFD700', charm:'coin',  cx:298,cy:62, text:'EXECUTIVE ORDER',   lg1:'#AABBFF',lg2:'#FFD700', seed:57 },
  // t058 Manifest Destiny — frontier orange brown
  { tpl:TplCapitol,id:'t058', bg1:'#1A0800',bg2:'#441A00', mid1:'#774400',mid2:'#AA6633', fg1:'#FFCC88',fg2:'#FFD700', acc:'#FF8833', charm:'star',  cx:52, cy:36, text:'MANIFEST DESTINY',  lg1:'#FFCC88',lg2:'#FF8833', seed:58 },
  // t059 New Deal Wheel — Art Deco navy silver
  { tpl:TplCapitol,id:'t059', bg1:'#000A1A',bg2:'#001133', mid1:'#223366',mid2:'#445588', fg1:'#AABBCC',fg2:'#FFD700', acc:'#CC4444', charm:'coin',  cx:298,cy:62, text:'NEW DEAL WHEEL',    lg1:'#AABBCC',lg2:'#FFD700', seed:59 },
  // t060 Reaganomics Riches — patriotic red eagle gold
  { tpl:TplCapitol,id:'t060', bg1:'#1A0000',bg2:'#440000', mid1:'#003366',mid2:'#0055AA', fg1:'#FF5555',fg2:'#FFD700', acc:'#FF3333', charm:'star',  cx:52, cy:36, text:'REAGANOMICS',       lg1:'#FF5555',lg2:'#FFD700', seed:60 },
  // t061 Pork Barrel Profits — Capitol pink gold
  { tpl:TplCapitol,id:'t061', bg1:'#1A0011',bg2:'#330022', mid1:'#7A0033',mid2:'#AA1155', fg1:'#FFAACC',fg2:'#FFD700', acc:'#FF7799', charm:'coin',  cx:298,cy:62, text:'PORK BARREL',       lg1:'#FFAACC',lg2:'#FFD700', seed:61 },
  // t062 Stimulus Check Squared — mailbox green
  { tpl:TplCapitol,id:'t062', bg1:'#001800',bg2:'#004400', mid1:'#335533',mid2:'#558855', fg1:'#88FF88',fg2:'#FFD700', acc:'#44FF66', charm:'star',  cx:52, cy:36, text:'STIMULUS CHECK',    lg1:'#88FF88',lg2:'#FFD700', seed:62 },
  // t063 Founding Fathers' Fortune — colonial blue parchment
  { tpl:TplCapitol,id:'t063', bg1:'#000022',bg2:'#001155', mid1:'#551100',mid2:'#773300', fg1:'#AABBFF',fg2:'#FFEECC', acc:'#CC9944', charm:'chest', cx:298,cy:62, text:"FOUNDING FATHERS", lg1:'#AABBFF',lg2:'#FFEECC', seed:63 },
  // t064 Gold Rush 49 — California gold brown
  { tpl:TplCapitol,id:'t064', bg1:'#1A0A00',bg2:'#442200', mid1:'#886600',mid2:'#BB8800', fg1:'#FFD700',fg2:'#FFCC44', acc:'#FFB800', charm:'coin',  cx:52, cy:62, text:"GOLD RUSH '49",    lg1:'#FFD700',lg2:'#CC8800', seed:64 },
  // t065 Robber Baron Riches — Victorian purple gold
  { tpl:TplCapitol,id:'t065', bg1:'#0D0022',bg2:'#221133', mid1:'#440066',mid2:'#660088', fg1:'#CC88FF',fg2:'#FFD700', acc:'#AA55DD', charm:'coin',  cx:298,cy:62, text:'ROBBER BARON',      lg1:'#CC88FF',lg2:'#FFD700', seed:65 },
  // t066 The Gilded Age — ornate gold cream
  { tpl:TplCapitol,id:'t066', bg1:'#1A1000',bg2:'#443300', mid1:'#8B6000',mid2:'#CC9000', fg1:'#FFD700',fg2:'#FFFACC', acc:'#FFE055', charm:'chest', cx:52, cy:62, text:'THE GILDED AGE',    lg1:'#FFD700',lg2:'#CC9900', seed:66 },

  // ── Nature / Adventure ────────────────────────────────────────────────────
  // t067 Pot of Gold at End of Rainbow — rainbow hills
  { tpl:TplNature, id:'t067', bg1:'#001800',bg2:'#99EEFF', mid1:'#448844',mid2:'#66BB66', fg1:'#FFD700',fg2:'#FF6600', acc:'#FF88FF', charm:'coin',  cx:52, cy:62, text:'POT OF GOLD',       lg1:'#FF6600',lg2:'#FFDD00', seed:67 },
  // t068 Jungle Jackpot — deep jungle temple
  { tpl:TplNature, id:'t068', bg1:'#001400',bg2:'#003300', mid1:'#114411',mid2:'#226622', fg1:'#44BB44',fg2:'#FFD700', acc:'#88DD44', charm:'chest', cx:298,cy:62, text:'JUNGLE JACKPOT',    lg1:'#44BB44',lg2:'#AADD00', seed:68 },
  // t069 Deep Sea Dollars — ocean teal phosphorescent
  { tpl:TplNature, id:'t069', bg1:'#001010',bg2:'#002233', mid1:'#004455',mid2:'#006677', fg1:'#44DDCC',fg2:'#AAFFEE', acc:'#00FFDD', charm:'chest', cx:52, cy:62, text:'DEEP SEA $',        lg1:'#44DDCC',lg2:'#00BBAA', seed:69 },
  // t070 Mountain Money — alpine blue white
  { tpl:TplNature, id:'t070', bg1:'#000022',bg2:'#224488', mid1:'#334466',mid2:'#4466AA', fg1:'#AADDFF',fg2:'#FFFFFF', acc:'#88CCFF', charm:'star',  cx:298,cy:38, text:'MOUNTAIN MONEY',    lg1:'#AADDFF',lg2:'#4499CC', seed:70 },
  // t071 Desert Diamond — Saharan orange mirage
  { tpl:TplNature, id:'t071', bg1:'#1A0800',bg2:'#FF9933', mid1:'#AA6600',mid2:'#CC8800', fg1:'#FFEE88',fg2:'#FFFFFF', acc:'#FFD700', charm:'coin',  cx:52, cy:62, text:'DESERT DIAMOND',    lg1:'#FFEE88',lg2:'#FF8833', seed:71 },
  // t072 Arctic Stash — aurora teal purple
  { tpl:TplNature, id:'t072', bg1:'#001515',bg2:'#330044', mid1:'#005555',mid2:'#4400AA', fg1:'#44FFEE',fg2:'#CC88FF', acc:'#00FFEE', charm:'chest', cx:298,cy:62, text:'ARCTIC STASH',      lg1:'#44FFEE',lg2:'#CC88FF', seed:72 },
  // t073 Volcano of Cash — lava red magma
  { tpl:TplNature, id:'t073', bg1:'#1A0000',bg2:'#441100', mid1:'#883300',mid2:'#BB4400', fg1:'#FF6600',fg2:'#FFCC00', acc:'#FF4400', charm:'star',  cx:52, cy:38, text:'VOLCANO OF CASH',   lg1:'#FF6600',lg2:'#FFCC00', seed:73 },
  // t074 Sahara Scratch — dune orange pharaoh
  { tpl:TplNature, id:'t074', bg1:'#1A0A00',bg2:'#CC7700', mid1:'#886600',mid2:'#BBAA44', fg1:'#FFEE88',fg2:'#FFD700', acc:'#FF9933', charm:'coin',  cx:298,cy:62, text:'SAHARA SCRATCH',    lg1:'#FFEE88',lg2:'#CC8833', seed:74 },
  // t075 Thunder Storm Treasure — storm silver lightning
  { tpl:TplNature, id:'t075', bg1:'#111122',bg2:'#223355', mid1:'#334466',mid2:'#445577', fg1:'#CCDDFF',fg2:'#FFFFFF', acc:'#AABBFF', charm:'coin',  cx:52, cy:62, text:'THUNDER STORM',     lg1:'#CCDDFF',lg2:'#8899FF', seed:75 },
  // t076 Northern Lights Lottery — aurora rainbow
  { tpl:TplNature, id:'t076', bg1:'#000511',bg2:'#001122', mid1:'#003344',mid2:'#005566', fg1:'#44FFCC',fg2:'#FF88FF', acc:'#00FFAA', charm:'star',  cx:298,cy:38, text:'NORTHERN LIGHTS',   lg1:'#44FFCC',lg2:'#FF88FF', seed:76 },

  // ── Holidays / Seasons ────────────────────────────────────────────────────
  // t077 Holiday Cash Craze — Christmas red green
  { tpl:TplFestive,id:'t077', bg1:'#1A0000',bg2:'#440000', mid1:'#003300',mid2:'#004400', fg1:'#FF4444',fg2:'#44FF66', acc:'#FFD700', charm:'star',  cx:298,cy:36, text:'HOLIDAY CASH',      lg1:'#FF4444',lg2:'#FFD700', seed:77 },
  // t078 St. Patrick's Pot — shamrock green gold
  { tpl:TplFestive,id:'t078', bg1:'#001800',bg2:'#004400', mid1:'#226622',mid2:'#44AA44', fg1:'#44FF88',fg2:'#FFD700', acc:'#00FF66', charm:'coin',  cx:52, cy:36, text:"ST. PADDY'S POT",  lg1:'#44FF88',lg2:'#FFD700', seed:78 },
  // t079 Halloween Haul — pumpkin orange midnight
  { tpl:TplFestive,id:'t079', bg1:'#0A0500',bg2:'#1A0800', mid1:'#553300',mid2:'#884400', fg1:'#FF8800',fg2:'#CC44FF', acc:'#FF6600', charm:'chest', cx:298,cy:62, text:'HALLOWEEN HAUL',    lg1:'#FF8800',lg2:'#CC44FF', seed:79 },
  // t080 Valentine's Vault — rose pink love
  { tpl:TplFestive,id:'t080', bg1:'#1A0011',bg2:'#440022', mid1:'#880033',mid2:'#CC1155', fg1:'#FF88BB',fg2:'#FFD700', acc:'#FF4488', charm:'coin',  cx:52, cy:62, text:"VALENTINE'S VAULT", lg1:'#FF88BB',lg2:'#FF4488', seed:80 },
  // t081 Fourth of July Fortune — patriotic firework
  { tpl:TplFestive,id:'t081', bg1:'#000A1A',bg2:'#001133', mid1:'#880000',mid2:'#BB0000', fg1:'#FF4444',fg2:'#FFFFFF', acc:'#FFD700', charm:'star',  cx:298,cy:36, text:'JULY FORTUNE',      lg1:'#FF4444',lg2:'#4466FF', seed:81 },
  // t082 Summer Scorcher Scratch — blazing beach orange
  { tpl:TplFestive,id:'t082', bg1:'#1A0800',bg2:'#FF9900', mid1:'#CC5500',mid2:'#FF7700', fg1:'#FFEE44',fg2:'#44AAFF', acc:'#FFD700', charm:'coin',  cx:52, cy:62, text:'SUMMER SCORCHER',   lg1:'#FFEE44',lg2:'#FF6600', seed:82 },
  // t083 Winter Windfall — frost teal snow
  { tpl:TplFestive,id:'t083', bg1:'#001515',bg2:'#003333', mid1:'#004444',mid2:'#336666', fg1:'#AAFFFF',fg2:'#FFFFFF', acc:'#00FFEE', charm:'star',  cx:298,cy:36, text:'WINTER WINDFALL',   lg1:'#AAFFFF',lg2:'#44BBCC', seed:83 },
  // t084 Spring Cash Fling — blossom pink green
  { tpl:TplFestive,id:'t084', bg1:'#1A0011',bg2:'#440022', mid1:'#224400',mid2:'#448800', fg1:'#FFAACC',fg2:'#88DD44', acc:'#FF88CC', charm:'chest', cx:52, cy:62, text:'SPRING FLING',      lg1:'#FFAACC',lg2:'#88DD44', seed:84 },

  // ── Jobs / Careers ────────────────────────────────────────────────────────
  // t085 Overtime Payday — factory blue timecard
  { tpl:TplDesk,   id:'t085', bg1:'#000022',bg2:'#001155', mid1:'#222233',mid2:'#334466', fg1:'#AABBFF',fg2:'#FFD700', acc:'#88AAFF', charm:'coin',  cx:52, cy:38, text:'OVERTIME',          lg1:'#AABBFF',lg2:'#FFD700', seed:85 },
  // t086 The Big Promotion — promotion green gold
  { tpl:TplDesk,   id:'t086', bg1:'#001800',bg2:'#004400', mid1:'#223322',mid2:'#335533', fg1:'#44FF88',fg2:'#FFD700', acc:'#00FF66', charm:'star',  cx:298,cy:38, text:'BIG PROMOTION',     lg1:'#44FF88',lg2:'#FFD700', seed:86 },
  // t087 CEO for a Day — executive silver charcoal
  { tpl:TplDesk,   id:'t087', bg1:'#0A0A0A',bg2:'#1A1A1A', mid1:'#333333',mid2:'#555555', fg1:'#CCCCCC',fg2:'#FFD700', acc:'#FFFFFF', charm:'coin',  cx:52, cy:62, text:'CEO FOR A DAY',     lg1:'#CCCCCC',lg2:'#FFD700', seed:87 },
  // t088 Plumber's Plunder — pipe blue copper
  { tpl:TplDesk,   id:'t088', bg1:'#000022',bg2:'#001155', mid1:'#553300',mid2:'#884422', fg1:'#AABBFF',fg2:'#CC9966', acc:'#8899FF', charm:'star',  cx:298,cy:38, text:"PLUMBER'S PLUNDER", lg1:'#AABBFF',lg2:'#CC9966', seed:88 },
  // t089 Doctor's Dollars — medical teal white
  { tpl:TplDesk,   id:'t089', bg1:'#001515',bg2:'#003333', mid1:'#004455',mid2:'#006677', fg1:'#44DDCC',fg2:'#FFFFFF', acc:'#00FFEE', charm:'coin',  cx:52, cy:62, text:"DOCTOR'S DOLLARS",  lg1:'#44DDCC',lg2:'#FFFFFF', seed:89 },
  // t090 Lawyer's Lucky Day — courtroom purple gold
  { tpl:TplDesk,   id:'t090', bg1:'#0D0022',bg2:'#221133', mid1:'#441100',mid2:'#663300', fg1:'#BB88FF',fg2:'#FFD700', acc:'#9955CC', charm:'star',  cx:298,cy:38, text:"LAWYER'S LUCKY DAY", lg1:'#BB88FF',lg2:'#FFD700', seed:90 },
  // t091 Teacher's Treasure — classroom orange chalk
  { tpl:TplDesk,   id:'t091', bg1:'#1A0800',bg2:'#443300', mid1:'#553300',mid2:'#885500', fg1:'#FFCC88',fg2:'#FFEECC', acc:'#FF8833', charm:'chest', cx:52, cy:62, text:"TEACHER'S TREASURE", lg1:'#FFCC88',lg2:'#FF8833', seed:91 },
  // t092 Astronaut's Allowance — space nebula silver
  { tpl:TplDesk,   id:'t092', bg1:'#000511',bg2:'#001122', mid1:'#222244',mid2:'#334466', fg1:'#CCDDFF',fg2:'#FF88FF', acc:'#AABBFF', charm:'star',  cx:298,cy:38, text:"ASTRONAUT'S ALLOWANCE", lg1:'#CCDDFF',lg2:'#FF88FF', seed:92 },

  // ── Animals ───────────────────────────────────────────────────────────────
  // t093 Lucky Cat's Wallet — maneki gold red
  { tpl:TplAnimal, id:'t093', bg1:'#1A0500',bg2:'#440D00', mid1:'#884400',mid2:'#CC6600', fg1:'#FFD700',fg2:'#FF8833', acc:'#FF4400', charm:'coin',  cx:298,cy:62, text:"LUCKY CAT",          lg1:'#FFD700',lg2:'#FF4400', seed:93 },
  // t094 Golden Goose Eggs — barnyard gold amber
  { tpl:TplAnimal, id:'t094', bg1:'#1A1000',bg2:'#443300', mid1:'#886600',mid2:'#BB9900', fg1:'#FFD700',fg2:'#FFEEAA', acc:'#FFB800', charm:'coin',  cx:52, cy:62, text:'GOLDEN GOOSE',      lg1:'#FFD700',lg2:'#CC9900', seed:94 },
  // t095 Fat Cat Fortune — wealth purple ivory
  { tpl:TplAnimal, id:'t095', bg1:'#0D0022',bg2:'#221133', mid1:'#330055',mid2:'#550077', fg1:'#CC88FF',fg2:'#FFFAEE', acc:'#AA55DD', charm:'coin',  cx:298,cy:62, text:'FAT CAT',           lg1:'#CC88FF',lg2:'#FFFAEE', seed:95 },
  // t096 Cash Cow Classic — pastoral green white
  { tpl:TplAnimal, id:'t096', bg1:'#001800',bg2:'#336633', mid1:'#448844',mid2:'#66AA66', fg1:'#FFFFFF',fg2:'#111111', acc:'#44FF88', charm:'star',  cx:52, cy:38, text:'CASH COW',          lg1:'#FFFFFF',lg2:'#44AA55', seed:96 },
  // t097 Lucky Duck Bucks — pond teal yellow
  { tpl:TplAnimal, id:'t097', bg1:'#001515',bg2:'#224422', mid1:'#005555',mid2:'#226622', fg1:'#FFEE44',fg2:'#AADDFF', acc:'#44DDCC', charm:'star',  cx:298,cy:38, text:'LUCKY DUCK',        lg1:'#FFEE44',lg2:'#44DDCC', seed:97 },
  // t098 Elephant's Memory Bank — temple blue ivory
  { tpl:TplAnimal, id:'t098', bg1:'#000022',bg2:'#001155', mid1:'#334466',mid2:'#445588', fg1:'#AABBDD',fg2:'#FFFAEE', acc:'#AABBFF', charm:'chest', cx:52, cy:62, text:"ELEPHANT'S BANK",   lg1:'#AABBDD',lg2:'#FFFAEE', seed:98 },
  // t099 Peacock's Prize — rainbow peacock garden
  { tpl:TplAnimal, id:'t099', bg1:'#001400',bg2:'#003300', mid1:'#003366',mid2:'#224488', fg1:'#44FFCC',fg2:'#FF88FF', acc:'#FFDD00', charm:'coin',  cx:298,cy:62, text:"PEACOCK'S PRIZE",   lg1:'#44FFCC',lg2:'#FF88FF', seed:99 },
  // t100 Dragon Hoard Dollars — dragon red cave gold
  { tpl:TplAnimal, id:'t100', bg1:'#1A0000',bg2:'#440000', mid1:'#881111',mid2:'#BB2222', fg1:'#FF4444',fg2:'#FFD700', acc:'#FF3300', charm:'chest', cx:52, cy:62, text:'DRAGON HOARD',      lg1:'#FF4444',lg2:'#FFD700', seed:100},

  // ── Random / Absurd ───────────────────────────────────────────────────────
  // t101 Grandma's Secret Stash — parlor pink cream
  { tpl:TplAbsurd, id:'t101', bg1:'#1A0011',bg2:'#440022', mid1:'#883355',mid2:'#BB6677', fg1:'#FFAABB',fg2:'#FFEECC', acc:'#FF88AA', charm:'chest', cx:298,cy:62, text:"GRANDMA'S STASH",   lg1:'#FFAABB',lg2:'#FF6688', seed:101},
  // t102 Lottery Ticket Inception — meta purple silver
  { tpl:TplAbsurd, id:'t102', bg1:'#0D0022',bg2:'#221133', mid1:'#330066',mid2:'#4400AA', fg1:'#CC88FF',fg2:'#CCCCDD', acc:'#AA55FF', charm:'coin',  cx:52, cy:62, text:'INCEPTION',         lg1:'#CC88FF',lg2:'#888899', seed:102},
  // t103 Scratch or Sniff — primary rainbow sniff
  { tpl:TplAbsurd, id:'t103', bg1:'#1A0044',bg2:'#440088', mid1:'#FF4444',mid2:'#4444FF', fg1:'#FFD700',fg2:'#FF66FF', acc:'#44FF88', charm:'coin',  cx:298,cy:62, text:'SCRATCH OR SNIFF',  lg1:'#FFD700',lg2:'#FF66FF', seed:103},
  // t104 Fool's Gold Rush — sepia clown gold
  { tpl:TplAbsurd, id:'t104', bg1:'#1A1000',bg2:'#443300', mid1:'#AA5500',mid2:'#CC7700', fg1:'#FFD700',fg2:'#FF4444', acc:'#FFB800', charm:'star',  cx:52, cy:38, text:"FOOL'S GOLD",       lg1:'#FFD700',lg2:'#FF4444', seed:104},
  // t105 Lucky Larry's Last Resort — saloon red jackpot
  { tpl:TplAbsurd, id:'t105', bg1:'#1A0000',bg2:'#440000', mid1:'#663300',mid2:'#AA5500', fg1:'#FF6633',fg2:'#FFD700', acc:'#FF4400', charm:'chest', cx:298,cy:62, text:"LUCKY LARRY'S",     lg1:'#FF6633',lg2:'#FFD700', seed:105},
  // t106 Ponzi Scheme The Game — pyramid green gold
  { tpl:TplAbsurd, id:'t106', bg1:'#001800',bg2:'#004400', mid1:'#558800',mid2:'#88BB00', fg1:'#CCFF44',fg2:'#FFD700', acc:'#AAFF00', charm:'coin',  cx:52, cy:62, text:'PONZI SCHEME',      lg1:'#CCFF44',lg2:'#FFD700', seed:106},
  // t107 Clearance Sale Jackpot — sale orange red
  { tpl:TplAbsurd, id:'t107', bg1:'#1A0800',bg2:'#441100', mid1:'#882200',mid2:'#CC3300', fg1:'#FF8833',fg2:'#FFDD44', acc:'#FF4400', charm:'star',  cx:298,cy:38, text:'CLEARANCE SALE',    lg1:'#FF8833',lg2:'#FFDD44', seed:107},
  // t108 Coupon King Jackpot — olive newspaper black
  { tpl:TplAbsurd, id:'t108', bg1:'#101A00',bg2:'#203300', mid1:'#334400',mid2:'#556600', fg1:'#CCEE88',fg2:'#FFFFFF', acc:'#AADD00', charm:'coin',  cx:52, cy:62, text:'COUPON KING',       lg1:'#CCEE88',lg2:'#AADD00', seed:108},
  // t109 Lost Vegas — neon casino night gold
  { tpl:TplAbsurd, id:'t109', bg1:'#0A0500',bg2:'#1A1000', mid1:'#553300',mid2:'#885500', fg1:'#FFD700',fg2:'#FF44BB', acc:'#FF8800', charm:'coin',  cx:298,cy:62, text:'LOST VEGAS',        lg1:'#FFD700',lg2:'#FF44BB', seed:109},
  // t110 Participation Trophy — consolation silver rainbow
  { tpl:TplAbsurd, id:'t110', bg1:'#111122',bg2:'#222233', mid1:'#444455',mid2:'#666677', fg1:'#CCCCDD',fg2:'#FF88FF', acc:'#FFFFFF', charm:'star',  cx:52, cy:38, text:'PARTICIPANT!',      lg1:'#CCCCDD',lg2:'#FF88FF', seed:110},
  // t111 Florida Man's Fortune — swamp teal sunset
  { tpl:TplAbsurd, id:'t111', bg1:'#001515',bg2:'#002828', mid1:'#225533',mid2:'#447755', fg1:'#44DDCC',fg2:'#FF8844', acc:'#00FFEE', charm:'chest', cx:298,cy:62, text:'FLORIDA MAN',       lg1:'#44DDCC',lg2:'#FF8844', seed:111},
  // t112 Scratch Daddy — cool silver black velvet
  { tpl:TplAbsurd, id:'t112', bg1:'#080808',bg2:'#181818', mid1:'#333333',mid2:'#555555', fg1:'#CCCCDD',fg2:'#FF8833', acc:'#FFFFFF', charm:'coin',  cx:52, cy:62, text:'SCRATCH DADDY',     lg1:'#CCCCDD',lg2:'#FF8833', seed:112},
  // t113 Millionaire's Mindset — thought purple eureka
  { tpl:TplAbsurd, id:'t113', bg1:'#0D0022',bg2:'#221133', mid1:'#440066',mid2:'#6600AA', fg1:'#BB88FF',fg2:'#FFD700', acc:'#AA55DD', charm:'star',  cx:298,cy:38, text:"MILLIONAIRE'S MINDSET", lg1:'#BB88FF',lg2:'#FFD700', seed:113},
  // t114 The Algorithm Ate My Savings — matrix blue green
  { tpl:TplAbsurd, id:'t114', bg1:'#000511',bg2:'#001100', mid1:'#003300',mid2:'#005500', fg1:'#44AAFF',fg2:'#44FF88', acc:'#00FF44', charm:'coin',  cx:52, cy:62, text:'THE ALGORITHM',     lg1:'#44AAFF',lg2:'#44FF88', seed:114},
  // t115 Side Hustle Supreme — hustle orange gold
  { tpl:TplAbsurd, id:'t115', bg1:'#1A0800',bg2:'#441A00', mid1:'#663300',mid2:'#994400', fg1:'#FF8833',fg2:'#FFD700', acc:'#FFAA55', charm:'star',  cx:298,cy:38, text:'SIDE HUSTLE',       lg1:'#FF8833',lg2:'#FFD700', seed:115},
  // t116 Avocado Toast Tax — avocado olive cream
  { tpl:TplAbsurd, id:'t116', bg1:'#101A00',bg2:'#203300', mid1:'#446622',mid2:'#668844', fg1:'#AAEE44',fg2:'#FFEECC', acc:'#88CC00', charm:'chest', cx:52, cy:62, text:'AVOCADO TOAST TAX',  lg1:'#AAEE44',lg2:'#FFEECC', seed:116},
  // t117 Debt Collector Deflector — maroon armor gold
  { tpl:TplAbsurd, id:'t117', bg1:'#1A0009',bg2:'#33001A', mid1:'#660022',mid2:'#990033', fg1:'#FF6699',fg2:'#FFD700', acc:'#FF3366', charm:'star',  cx:298,cy:38, text:'DEBT DEFLECTOR',    lg1:'#FF6699',lg2:'#FFD700', seed:117},
  // t118 The Accountant's Secret — ledger silver green
  { tpl:TplAbsurd, id:'t118', bg1:'#0D0D1A',bg2:'#1A1A2E', mid1:'#002200',mid2:'#003300', fg1:'#CCCCDD',fg2:'#44FF88', acc:'#AAAACC', charm:'chest', cx:52, cy:62, text:"ACCOUNTANT'S SECRET", lg1:'#CCCCDD',lg2:'#44FF88', seed:118},
  // t119 Gig Economy Giant — delivery orange teal
  { tpl:TplAbsurd, id:'t119', bg1:'#1A0800',bg2:'#441A00', mid1:'#005555',mid2:'#008888', fg1:'#FF8833',fg2:'#44DDCC', acc:'#FFAA55', charm:'coin',  cx:298,cy:62, text:'GIG ECONOMY',       lg1:'#FF8833',lg2:'#44DDCC', seed:119},
  // t120 Retirement YOLO — sunset teal tropical
  { tpl:TplAbsurd, id:'t120', bg1:'#001515',bg2:'#002828', mid1:'#005555',mid2:'#008888', fg1:'#FF8844',fg2:'#44FFEE', acc:'#00FFEE', charm:'chest', cx:52, cy:62, text:'RETIREMENT YOLO',   lg1:'#FF8844',lg2:'#44FFEE', seed:120},
];

// ── Build ILLUSTRATIONS map ──────────────────────────────────────────────────
// Each entry is a React component (receives `palette` prop, returns SVG).
export const ILLUSTRATIONS = Object.fromEntries(
  C.map(cfg => [
    cfg.id,
    ({ palette }) => {   // eslint-disable-line no-unused-vars
      const { tpl: Tpl, ...rest } = cfg;
      return <Tpl {...rest} />;
    },
  ])
);

export function getIllustration(themeId) {
  const Cmp = ILLUSTRATIONS[themeId];
  return Cmp || null;
}
