import { FORMATIONS, FORMATION_KEYS } from './formations.js';

// ─── Base Palettes ────────────────────────────────────────────────────────────
const P = {
  gold:    { bg: ['#1a0a00', '#5a3500'], hdr: ['#8B6000', '#FFD700', '#8B6000'], border: '#DAA520', scratch: '#8B6914', text: '#FFF8DC', numBg: '#2d1800', numText: '#FFD700', accent: '#FFE55C' },
  green:   { bg: ['#001800', '#003800'], hdr: ['#004d00', '#00aa00', '#004d00'], border: '#00AA00', scratch: '#005500', text: '#CCFFCC', numBg: '#002200', numText: '#44FF88', accent: '#00FF66' },
  blue:    { bg: ['#000022', '#000050'], hdr: ['#0a1f6e', '#3a6bff', '#0a1f6e'], border: '#2244CC', scratch: '#0d2280', text: '#CCE4FF', numBg: '#000033', numText: '#66AAFF', accent: '#88CCFF' },
  red:     { bg: ['#1a0000', '#440000'], hdr: ['#6e0000', '#cc1a00', '#6e0000'], border: '#AA1100', scratch: '#660000', text: '#FFCCCC', numBg: '#220000', numText: '#FF6666', accent: '#FF4444' },
  purple:  { bg: ['#0d0022', '#220044'], hdr: ['#38006e', '#8822cc', '#38006e'], border: '#6622AA', scratch: '#330077', text: '#DDCCFF', numBg: '#110022', numText: '#BB66FF', accent: '#CC88FF' },
  silver:  { bg: ['#1a1a2e', '#16213e'], hdr: ['#404050', '#909098', '#404050'], border: '#707080', scratch: '#404058', text: '#EEEEFF', numBg: '#0d0d1a', numText: '#C8C8D8', accent: '#DDDDEE' },
  orange:  { bg: ['#1a0800', '#441800'], hdr: ['#7a2d00', '#e05e00', '#7a2d00'], border: '#CC4400', scratch: '#772200', text: '#FFE0CC', numBg: '#221000', numText: '#FF9944', accent: '#FFAA55' },
  pink:    { bg: ['#1a0011', '#330022'], hdr: ['#7a0033', '#dd1166', '#7a0033'], border: '#CC1155', scratch: '#660022', text: '#FFCCDD', numBg: '#220011', numText: '#FF77BB', accent: '#FF88CC' },
  teal:    { bg: ['#001515', '#002828'], hdr: ['#005555', '#00aaaa', '#005555'], border: '#008888', scratch: '#004444', text: '#CCFFFF', numBg: '#001818', numText: '#44DDDD', accent: '#00FFEE' },
  rainbow: { bg: ['#0d001a', '#001a33'], hdr: ['#550099', '#0055bb', '#007733'], border: '#9933FF', scratch: '#330066', text: '#FFFFFF', numBg: '#0d0022', numText: '#FFCC00', accent: '#FF66FF' },
  crimson: { bg: ['#1a000d', '#40001a'], hdr: ['#7a0022', '#dd0044', '#7a0022'], border: '#CC0033', scratch: '#660011', text: '#FFCCDD', numBg: '#1a0011', numText: '#FF4477', accent: '#FF2255' },
  olive:   { bg: ['#101a00', '#203300'], hdr: ['#445500', '#8aaa00', '#445500'], border: '#667700', scratch: '#334400', text: '#F0FFCC', numBg: '#141f00', numText: '#AADD00', accent: '#CCFF00' },
  navy:    { bg: ['#000a1a', '#001033'], hdr: ['#001a55', '#003399', '#001a55'], border: '#004499', scratch: '#001a44', text: '#CCE0FF', numBg: '#000a22', numText: '#4488FF', accent: '#5599FF' },
  maroon:  { bg: ['#1a0009', '#33001a'], hdr: ['#660022', '#990033', '#660022'], border: '#880022', scratch: '#440011', text: '#FFCCEE', numBg: '#1a000d', numText: '#FF6699', accent: '#FF3377' },
  copper:  { bg: ['#1a0d00', '#3d1f00'], hdr: ['#7a3d00', '#b56400', '#7a3d00'], border: '#BB6622', scratch: '#663300', text: '#FFE8CC', numBg: '#22100a', numText: '#FF9944', accent: '#FFBB66' },
};

// ─── 120 Themes ───────────────────────────────────────────────────────────────
const raw = [
  // Money / Finance
  { id: 't001', name: 'A Milli A Milli A Milli',       price: 20, emoji: '💵', tagline: '9 CHANCES TO WIN A MILLI!',          p: 'gold',   illustrationImage: '/illustrations/IllT001.png' },
  { id: 't002', name: 'Debt Breaker',                   price: 10, emoji: '✂️', tagline: 'CUT YOUR DEBT — WIN BIG!',            p: 'red'     },
  { id: 't003', name: "Bob Dole's Bank Roll",           price: 10, emoji: '🇺🇸', tagline: 'AMERICA RUNS ON JACKPOTS!',           p: 'blue'    },
  { id: 't004', name: '401-Ka-Ching',                   price:  5, emoji: '📈', tagline: 'RETIRE A MILLIONAIRE!',               p: 'green'   },
  { id: 't005', name: 'Hedge Fund Honeypot',            price: 20, emoji: '🍯', tagline: 'SWEET RETURNS GUARANTEED*',           p: 'gold'    },
  { id: 't006', name: 'The Bailout',                    price: 10, emoji: '🏦', tagline: 'TOO BIG TO LOSE!',                    p: 'silver'  },
  { id: 't007', name: 'Too Big To Fail',                price: 20, emoji: '🏛️', tagline: 'WIN OR WIN EVEN BIGGER!',             p: 'blue'    },
  { id: 't008', name: 'Bull Run Bonanza',               price: 10, emoji: '🐂', tagline: '9 BULLISH CHANCES!',                  p: 'green'   },
  { id: 't009', name: 'Bear Trap Bucks',                price:  5, emoji: '🐻', tagline: 'ESCAPE THE BEAR, WIN!',               p: 'red'     },
  { id: 't010', name: 'Quantitative Easing',            price: 20, emoji: '🖨️', tagline: 'PRINT YOUR OWN LUCK!',                p: 'silver'  },
  { id: 't011', name: 'Crypto Comeback',                price: 10, emoji: '₿',  tagline: 'TO THE MOON AND BACK!',               p: 'orange'  },
  { id: 't012', name: 'Wall Street Windfall',           price: 20, emoji: '📊', tagline: 'BEAT THE MARKET TODAY!',              p: 'navy'    },
  { id: 't013', name: 'Tax Refund Turbo',               price:  5, emoji: '💸', tagline: 'GET WAY MORE BACK!',                  p: 'green'   },
  { id: 't014', name: 'Compound Interest',              price:  2, emoji: '📉', tagline: 'WATCH YOUR LUCK GROW!',               p: 'teal'    },
  { id: 't015', name: 'The Inheritance',                price: 10, emoji: '🏰', tagline: 'CLAIM YOUR BIRTHRIGHT!',              p: 'purple'  },

  // Food
  { id: 't016', name: 'Breakfast of Champions',        price:  5, emoji: '🥞', tagline: 'START THE DAY WITH CASH!',            p: 'orange'  },
  { id: 't017', name: 'Bacon & Eggs Benedict',         price:  5, emoji: '🥓', tagline: '9 TASTY CHANCES!',                    p: 'copper'  },
  { id: 't018', name: 'Golden Nuggets',                price: 10, emoji: '🍗', tagline: "FINGER LICKIN' RICH!",                p: 'gold'    },
  { id: 't019', name: 'Doughnut Dollars',              price:  2, emoji: '🍩', tagline: 'ROUND UP YOUR WINNINGS!',             p: 'pink'    },
  { id: 't020', name: 'Pizza Party Payday',            price:  5, emoji: '🍕', tagline: 'EVERY SLICE IS A PRIZE!',             p: 'red'     },
  { id: 't021', name: 'Taco Tuesday Treasure',         price:  2, emoji: '🌮', tagline: 'OLÉ — YOU COULD WIN!',               p: 'orange'  },
  { id: 't022', name: 'Loaded Baked Potato',           price:  5, emoji: '🥔', tagline: 'LOADED WITH PRIZES!',                p: 'gold'    },
  { id: 't023', name: 'Biscuits and Gravy Train',      price:  5, emoji: '🧇', tagline: 'ALL ABOARD FOR CASH!',               p: 'copper'  },
  { id: 't024', name: 'Deep Fried Fortune',            price:  5, emoji: '🍟', tagline: 'EXTRA CRISPY CASH!',                 p: 'gold'    },
  { id: 't025', name: 'Lobster Lottery',               price: 20, emoji: '🦞', tagline: 'LIVE LIKE ROYALTY!',                 p: 'crimson' },
  { id: 't026', name: 'Truffle Shuffle',               price: 20, emoji: '🍄', tagline: 'RARE PRIZES AWAIT!',                 p: 'purple'  },
  { id: 't027', name: 'Wagyu Wallet',                  price: 20, emoji: '🥩', tagline: 'PRIME GRADE PRIZES!',                p: 'maroon'  },
  { id: 't028', name: 'Caviar Dreams',                 price: 20, emoji: '🐟', tagline: 'LIVE YOUR BEST LIFE!',               p: 'teal'    },
  { id: 't029', name: 'Ice Cream Inheritance',         price:  2, emoji: '🍦', tagline: 'SWEET PRIZE AHEAD!',                 p: 'pink'    },
  { id: 't030', name: 'Nacho Average Jackpot',         price:  5, emoji: '🧀', tagline: "NACHO GONNA BELIEVE IT!",            p: 'orange'  },

  // Pop Culture
  { id: 't031', name: 'Mo Money Mo Problems',          price: 10, emoji: '💿', tagline: 'WE WANT MORE PROBLEMS!',             p: 'gold'    },
  { id: 't032', name: 'Show Me The Money',             price: 10, emoji: '🎬', tagline: 'YOU HAD US AT JACKPOT!',             p: 'green'   },
  { id: 't033', name: "Get Rich or Scratch Tryin'",    price:  5, emoji: '🎤', tagline: 'HUSTLE FOR YOUR PRIZE!',             p: 'silver'  },
  { id: 't034', name: 'Breaking Bank',                 price: 10, emoji: '🧪', tagline: 'I AM THE ONE WHO WINS!',             p: 'blue'    },
  { id: 't035', name: 'Scratch Empire',                price: 10, emoji: '👑', tagline: 'BUILD YOUR EMPIRE!',                p: 'purple'  },
  { id: 't036', name: 'Money Heist Mania',             price: 10, emoji: '🎭', tagline: 'BELLA CIAO... WITH CASH!',           p: 'red'     },
  { id: 't037', name: 'Succession Stakes',             price: 20, emoji: '🏢', tagline: "WHO GETS THE BILLIONS?",            p: 'navy'    },
  { id: 't038', name: 'Suits and Stacks',              price: 10, emoji: '👔', tagline: 'CLOSE THE DEAL!',                   p: 'silver'  },
  { id: 't039', name: 'Ozark Odds',                    price: 10, emoji: '🌊', tagline: 'LAUNDER YOUR LUCK!',                p: 'teal'    },
  { id: 't040', name: 'Wolf of Scratch Street',        price: 20, emoji: '🐺', tagline: 'SELL ME THIS TICKET!',              p: 'gold'    },
  { id: 't041', name: 'Billions Bonanza',              price: 20, emoji: '⚔️', tagline: 'MAKE YOUR PLAY!',                   p: 'blue'    },
  { id: 't042', name: 'Squid Game Scratch',            price:  5, emoji: '🦑', tagline: 'PLAY TO WIN... PERIOD.',            p: 'green'   },
  { id: 't043', name: "Seinfeld's Kramer Kash",        price:  5, emoji: '🚪', tagline: 'GIDDY UP — YOU WON!',              p: 'olive'   },
  { id: 't044', name: 'Jurassic Jackpot',              price: 10, emoji: '🦕', tagline: 'LIFE FINDS A WAY TO WIN!',          p: 'green'   },

  // Sports
  { id: 't045', name: "Sports Bettor's Revenge",       price: 10, emoji: '🎯', tagline: 'GET YOUR MONEY BACK!',              p: 'green'   },
  { id: 't046', name: 'Hail Mary Money',               price:  5, emoji: '🏈', tagline: 'ONE LAST CHANCE!',                  p: 'red'     },
  { id: 't047', name: 'Slam Dunk Dollars',             price:  5, emoji: '🏀', tagline: 'NOTHING BUT NET!',                  p: 'orange'  },
  { id: 't048', name: 'Home Run Hundreds',             price:  5, emoji: '⚾', tagline: 'SWING FOR THE FENCES!',             p: 'blue'    },
  { id: 't049', name: 'Hole in One',                   price: 10, emoji: '⛳', tagline: 'PERFECT SHOT, BIG PRIZE!',          p: 'green'   },
  { id: 't050', name: "Champion's Purse",              price: 20, emoji: '🏆', tagline: 'WINNER TAKES ALL!',                 p: 'gold'    },
  { id: 't051', name: 'Fantasy Fortune',               price:  5, emoji: '🧙', tagline: 'YOUR TEAM IS WINNING!',             p: 'purple'  },
  { id: 't052', name: 'Hat Trick Riches',              price:  5, emoji: '🏒', tagline: '3 IN A ROW!',                       p: 'blue'    },
  { id: 't053', name: 'Grand Slam Greenbacks',         price: 10, emoji: '🎾', tagline: 'LOVE ALL — WIN ALL!',               p: 'green'   },
  { id: 't054', name: 'The Podium Payout',             price: 10, emoji: '🥇', tagline: 'STAND ON TOP!',                    p: 'gold'    },
  { id: 't055', name: 'Pit Stop Payday',               price:  5, emoji: '🏎️', tagline: 'FULL SPEED TO CASH!',              p: 'red'     },
  { id: 't056', name: 'Knockout Cash',                 price:  5, emoji: '🥊', tagline: 'KNOCK OUT THE JACKPOT!',            p: 'crimson' },

  // Political / Historical
  { id: 't057', name: 'Executive Order: Rich',         price: 10, emoji: '📜', tagline: 'BY THE POWER OF LUCK!',             p: 'blue'    },
  { id: 't058', name: 'Manifest Destiny',              price:  5, emoji: '🗺️', tagline: 'GO WEST FOR RICHES!',              p: 'orange'  },
  { id: 't059', name: 'The New Deal Wheel',            price:  5, emoji: '🎡', tagline: 'SPIN INTO PROSPERITY!',             p: 'navy'    },
  { id: 't060', name: 'Reaganomics Riches',            price: 10, emoji: '🦅', tagline: 'TRICKLE-DOWN JACKPOTS!',            p: 'red'     },
  { id: 't061', name: 'Pork Barrel Profits',           price:  5, emoji: '🐷', tagline: 'BRING HOME THE BACON!',             p: 'pink'    },
  { id: 't062', name: 'Stimulus Check Squared',        price:  5, emoji: '💌', tagline: 'FREE MONEY... AGAIN!',              p: 'green'   },
  { id: 't063', name: "Founding Fathers' Fortune",     price: 10, emoji: '🪆', tagline: 'IN LUCK WE TRUST!',                p: 'blue'    },
  { id: 't064', name: "Gold Rush '49",                 price: 10, emoji: '⛏️', tagline: 'STRIKE IT RICH!',                   p: 'gold'    },
  { id: 't065', name: 'Robber Baron Riches',           price: 20, emoji: '🎩', tagline: 'MONOPOLIZE THE WIN!',               p: 'purple'  },
  { id: 't066', name: 'The Gilded Age',                price: 20, emoji: '🕰️', tagline: 'GOLDEN PRIZES INSIDE!',            p: 'gold'    },

  // Nature / Adventure
  { id: 't067', name: 'Pot of Gold at End of Rainbow', price:  5, emoji: '🌈', tagline: 'FOLLOW THE LUCK!',                  p: 'rainbow' },
  { id: 't068', name: 'Jungle Jackpot',                price:  5, emoji: '🌴', tagline: 'WILD PRIZES AWAIT!',               p: 'green'   },
  { id: 't069', name: 'Deep Sea Dollars',              price: 10, emoji: '🦈', tagline: 'DIVE FOR TREASURE!',               p: 'teal'    },
  { id: 't070', name: 'Mountain Money',                price:  5, emoji: '🏔️', tagline: 'PEAK PERFORMANCE PRIZES!',         p: 'blue'    },
  { id: 't071', name: 'Desert Diamond',                price: 10, emoji: '💎', tagline: 'HIDDEN GEM JACKPOT!',              p: 'orange'  },
  { id: 't072', name: 'Arctic Stash',                  price:  5, emoji: '🧊', tagline: 'COLD HARD CASH!',                  p: 'teal'    },
  { id: 't073', name: 'Volcano of Cash',               price: 10, emoji: '🌋', tagline: 'EXPLOSIVE PRIZES!',                p: 'red'     },
  { id: 't074', name: 'Sahara Scratch',                price:  5, emoji: '🐪', tagline: 'AN OASIS OF PRIZES!',              p: 'orange'  },
  { id: 't075', name: 'Thunder Storm Treasure',        price:  5, emoji: '⚡', tagline: 'LIGHTNING STRIKES TWICE!',         p: 'silver'  },
  { id: 't076', name: 'Northern Lights Lottery',       price: 10, emoji: '🌌', tagline: 'ILLUMINATE YOUR LUCK!',            p: 'rainbow' },

  // Holidays / Seasons
  { id: 't077', name: 'Holiday Cash Craze',            price:  5, emoji: '🎄', tagline: "TIS THE SEASON TO WIN!",           p: 'red'     },
  { id: 't078', name: "St. Patrick's Pot",             price:  5, emoji: '☘️', tagline: '9 LUCKY CHANCES!',                p: 'green'   },
  { id: 't079', name: 'Halloween Haul',                price:  5, emoji: '🎃', tagline: 'TRICK OR JACKPOT!',                p: 'orange'  },
  { id: 't080', name: "Valentine's Vault",             price:  5, emoji: '💝', tagline: 'LOVE IS IN THE WIN!',              p: 'pink'    },
  { id: 't081', name: 'Fourth of July Fortune',        price:  5, emoji: '🎆', tagline: 'INDEPENDENCE FROM BROKE!',         p: 'navy'    },
  { id: 't082', name: 'Summer Scorcher Scratch',       price:  5, emoji: '☀️', tagline: 'HOT HOT HOT PRIZES!',             p: 'orange'  },
  { id: 't083', name: 'Winter Windfall',               price:  5, emoji: '❄️', tagline: "LET IT SNOW... MONEY!",           p: 'teal'    },
  { id: 't084', name: 'Spring Cash Fling',             price:  2, emoji: '🌸', tagline: 'BLOOM INTO RICHES!',               p: 'pink'    },

  // Jobs / Careers
  { id: 't085', name: 'Overtime Pay Day',              price:  5, emoji: '⏰', tagline: 'TIME AND A HALF... TIMES TEN!',    p: 'blue'    },
  { id: 't086', name: 'The Big Promotion',             price: 10, emoji: '📋', tagline: "YOU'RE GETTING A RAISE!",          p: 'green'   },
  { id: 't087', name: 'CEO for a Day',                 price: 20, emoji: '💼', tagline: 'TAKE THE CORNER OFFICE!',          p: 'silver'  },
  { id: 't088', name: "Plumber's Plunder",             price:  5, emoji: '🔧', tagline: 'PIPE DREAM JACKPOT!',              p: 'blue'    },
  { id: 't089', name: "Doctor's Dollars",              price: 10, emoji: '🩺', tagline: 'THE DOCTOR IS RICH!',              p: 'teal'    },
  { id: 't090', name: "Lawyer's Lucky Day",            price: 20, emoji: '⚖️', tagline: 'OBJECTION: YOU WIN!',              p: 'purple'  },
  { id: 't091', name: "Teacher's Treasure",            price:  2, emoji: '📚', tagline: 'CLASS DISMISSED... RICH!',         p: 'orange'  },
  { id: 't092', name: "Astronaut's Allowance",         price: 10, emoji: '🚀', tagline: 'SHOOT FOR THE STARS!',             p: 'silver'  },

  // Animals
  { id: 't093', name: "Lucky Cat's Wallet",            price:  5, emoji: '🐱', tagline: '招財貓 JACKPOT!',                   p: 'gold'    },
  { id: 't094', name: 'Golden Goose Eggs',             price: 10, emoji: '🥚', tagline: "DON'T KILL THE GOOSE!",            p: 'gold'    },
  { id: 't095', name: 'Fat Cat Fortune',               price: 20, emoji: '😸', tagline: 'PURR-FECT PRIZES!',                p: 'purple'  },
  { id: 't096', name: 'Cash Cow Classic',              price:  5, emoji: '🐄', tagline: 'MOO-VE TO THE JACKPOT!',           p: 'green'   },
  { id: 't097', name: 'Lucky Duck Bucks',              price:  2, emoji: '🦆', tagline: 'QUACK QUACK... KA-CHING!',         p: 'teal'    },
  { id: 't098', name: "Elephant's Memory Bank",        price: 10, emoji: '🐘', tagline: 'NEVER FORGET TO WIN!',             p: 'blue'    },
  { id: 't099', name: "Peacock's Prize",               price: 10, emoji: '🦚', tagline: 'SHOW YOUR TRUE COLORS!',           p: 'rainbow' },
  { id: 't100', name: 'Dragon Hoard Dollars',          price: 20, emoji: '🐉', tagline: 'GUARD YOUR TREASURE!',             p: 'red'     },

  // Random / Absurd
  { id: 't101', name: "Grandma's Secret Stash",        price:  5, emoji: '👵', tagline: 'CHECK UNDER THE MATTRESS!',        p: 'pink'    },
  { id: 't102', name: 'Lottery Ticket Inception',      price: 10, emoji: '🌀', tagline: 'A SCRATCH WITHIN A SCRATCH!',      p: 'purple'  },
  { id: 't103', name: 'Scratch or Sniff',              price:  2, emoji: '👃', tagline: 'IT SMELLS LIKE MONEY!',            p: 'rainbow' },
  { id: 't104', name: "Fool's Gold Rush",              price:  2, emoji: '🤡', tagline: "THIS TIME IT'S REAL!",             p: 'gold'    },
  { id: 't105', name: "Lucky Larry's Last Resort",     price:  5, emoji: '🎰', tagline: "LARRY'S COUNTING ON YOU!",         p: 'red'     },
  { id: 't106', name: 'Ponzi Scheme: The Game',        price:  5, emoji: '📐', tagline: 'EARLY INVESTORS WIN!',             p: 'green'   },
  { id: 't107', name: 'Clearance Sale Jackpot',        price:  1, emoji: '🏷️', tagline: 'EVERYTHING MUST GO!',              p: 'orange'  },
  { id: 't108', name: 'Coupon King Jackpot',           price:  1, emoji: '✂️', tagline: 'CLIP YOUR WAY TO RICHES!',         p: 'olive'   },
  { id: 't109', name: 'Lost Vegas',                    price: 10, emoji: '🎲', tagline: 'WHAT HAPPENS HERE... PAYS!',       p: 'gold'    },
  { id: 't110', name: 'The Participation Trophy',      price:  1, emoji: '🏅', tagline: "EVERYONE'S A WINNER!",             p: 'silver'  },
  { id: 't111', name: "Florida Man's Fortune",         price:  5, emoji: '🐊', tagline: 'ONLY IN FLORIDA!',                 p: 'teal'    },
  { id: 't112', name: 'Scratch Daddy',                 price: 10, emoji: '😎', tagline: "WHO'S YOUR SCRATCH DADDY?",        p: 'silver'  },
  { id: 't113', name: "Millionaire's Mindset",         price:  2, emoji: '🧠', tagline: 'THINK AND GROW RICH!',             p: 'purple'  },
  { id: 't114', name: 'The Algorithm Ate My Savings',  price:  5, emoji: '🤖', tagline: 'LET LUCK COMPUTE THE WIN!',        p: 'blue'    },
  { id: 't115', name: 'Side Hustle Supreme',           price:  5, emoji: '📦', tagline: 'PASSIVE INCOME, ACTIVE WIN!',      p: 'orange'  },
  { id: 't116', name: 'Avocado Toast Tax',             price:  2, emoji: '🥑', tagline: 'AFFORD A HOUSE AND MORE!',         p: 'olive'   },
  { id: 't117', name: 'Debt Collector Deflector',      price:  5, emoji: '🛡️', tagline: 'BEAT THE BILLS!',                  p: 'maroon'  },
  { id: 't118', name: "The Accountant's Secret",       price: 10, emoji: '🔢', tagline: "THE NUMBERS DON'T LIE!",           p: 'silver'  },
  { id: 't119', name: 'Gig Economy Giant',             price:  5, emoji: '🛵', tagline: 'DELIVER YOURSELF TO RICHES!',      p: 'orange'  },
  { id: 't120', name: 'Retirement YOLO',               price: 20, emoji: '🏖️', tagline: 'LAST BIG SHOT!',                   p: 'teal'    },
];

function fmtTopPrize(price) {
  const v = price * 500;
  return v.toLocaleString() + ' COINS';
}

// Formation scales with price: more cells = more complex = higher stakes
// Minimum 4×2 (8 cells), maximum 5×5 (25 cells)
function formationForPrice(price) {
  if (price <= 3)  return FORMATIONS.grid4x2;  //  8 cells (4×2)
  if (price <= 7)  return FORMATIONS.classic;  //  9 cells (3×3)
  if (price <= 12) return FORMATIONS.grid4x3;  // 12 cells (4×3)
  if (price <= 17) return FORMATIONS.grid4x4;  // 16 cells (4×4)
  return FORMATIONS.grid5x5;                   // 25 cells (5×5)
}

// Tilt values cycling across themes: alternating subtle angles
const TILTS = [-1.2, 0.8, -0.5, 1.5, -1.0, 0.6, -1.8, 1.1, -0.7, 1.3];

export const THEMES = raw.map((t, i) => ({
  ...t,
  palette: P[t.p],
  topPrize: fmtTopPrize(t.price),
  formation: formationForPrice(t.price),
  tilt: TILTS[i % TILTS.length],
}));

export function getRandomTheme(retiredMaxCost = 0) {
  const pool = retiredMaxCost > 0 ? THEMES.filter(t => t.price > retiredMaxCost) : THEMES;
  // Safety: if all themes are filtered out (shouldn't happen), fall back to full pool
  const src = pool.length > 0 ? pool : THEMES;
  return src[Math.floor(Math.random() * src.length)];
}

// ─── High-Stakes Themes ($30 bridge + $50/$100/$200/$1000/$2000) ──────────────
const rawHighStakes = [
  // $30 — bridge tier
  { id: 'hs030a', name: 'The Ante Up',      price:   30, emoji: '🃏', tagline: 'RAISE YOUR STAKES',              p: 'silver' },
  { id: 'hs030b', name: 'High Roller',      price:   30, emoji: '🎰', tagline: 'WHERE THE REAL GAME BEGINS',     p: 'gold'   },
  // $50
  { id: 'hs050a', name: 'Platinum Ticket',  price:   50, emoji: '💎', tagline: 'PREMIUM ODDS. PREMIUM PRIZES.',  p: 'silver' },
  { id: 'hs050b', name: 'The High Five',    price:   50, emoji: '✋', tagline: 'FIVE TIMES THE EXCITEMENT',      p: 'purple' },
  // $100
  { id: 'hs100a', name: 'Century Club',     price:  100, emoji: '💯', tagline: 'FOR PLAYERS WHO MEAN BUSINESS',  p: 'gold'   },
  { id: 'hs100b', name: 'The Benjamin',     price:  100, emoji: '💵', tagline: 'IN FRANKLIN WE TRUST',           p: 'green'  },
  // $200
  { id: 'hs200a', name: 'Double Century',   price:  200, emoji: '⚜️', tagline: 'DOUBLE DOWN ON DESTINY',         p: 'gold'   },
  { id: 'hs200b', name: 'Black Label',      price:  200, emoji: '🖤', tagline: 'RESERVED FOR THE BOLD',          p: 'navy'   },
  // $1 000
  { id: 'hs1ka',  name: 'The Grand',        price: 1000, emoji: '👑', tagline: 'A THOUSAND REASONS TO WIN',      p: 'gold'   },
  { id: 'hs1kb',  name: 'Midas Touch',      price: 1000, emoji: '✨', tagline: 'EVERYTHING TURNS TO GOLD',       p: 'copper' },
  // $2 000
  { id: 'hs2ka',  name: 'Untouchable',      price: 2000, emoji: '🏆', tagline: 'LEGEND STATUS',                  p: 'gold'   },
  { id: 'hs2kb',  name: 'The Two Grand',    price: 2000, emoji: '🌟', tagline: 'FOR THE SERIOUS PLAYER ONLY',    p: 'rainbow'},
];

export const HIGH_STAKES_THEMES = rawHighStakes.map((t, i) => ({
  ...t,
  palette:   P[t.p],
  topPrize:  fmtTopPrize(t.price),
  formation: FORMATIONS.grid5x5,  // all high-stakes use 5×5
  tilt:      TILTS[i % TILTS.length],
}));

export function getRandomHighStakesTheme(price) {
  const pool = HIGH_STAKES_THEMES.filter(t => t.price === price);
  return pool[Math.floor(Math.random() * pool.length)];
}
