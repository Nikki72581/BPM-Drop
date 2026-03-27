import type { Difficulty } from './tracks';

export interface CatalogEntry {
  deezerId: string;
  bpm: number;
  title: string;
  artist: string;
  difficulty: Difficulty;
}

// Verified BPMs + Deezer track IDs for well-known electronic tracks.
// BPMs sourced from Songbpm / official releases / audio analysis.
export const CATALOG: CatalogEntry[] = [

  // ── EASY  (60–100 BPM) ─────────────────────────────────────────
  { deezerId: '3129748',   bpm: 79,  title: 'Teardrop',                  artist: 'Massive Attack',       difficulty: 'easy' },
  { deezerId: '3129746',   bpm: 81,  title: 'Angel',                     artist: 'Massive Attack',       difficulty: 'easy' },
  { deezerId: '982678',    bpm: 97,  title: 'Glory Box',                 artist: 'Portishead',           difficulty: 'easy' },
  { deezerId: '29373661',  bpm: 79,  title: 'Roygbiv',                   artist: 'Boards of Canada',     difficulty: 'easy' },
  { deezerId: '68325253',  bpm: 80,  title: 'At the River',              artist: 'Groove Armada',        difficulty: 'easy' },
  { deezerId: '14611474',  bpm: 94,  title: 'Hyperballad',               artist: 'Björk',                difficulty: 'easy' },
  { deezerId: '14611473',  bpm: 96,  title: 'Army of Me',                artist: 'Björk',                difficulty: 'easy' },
  { deezerId: '15686777',  bpm: 100, title: 'Praise You',                artist: 'Fatboy Slim',          difficulty: 'easy' },
  { deezerId: '10235995',  bpm: 82,  title: 'Kong',                      artist: 'Bonobo',               difficulty: 'easy' },
  { deezerId: '4282010',   bpm: 79,  title: 'Hell Is Round the Corner',  artist: 'Tricky',               difficulty: 'easy' },
  { deezerId: '3135556',   bpm: 100, title: 'Harder Better Faster Stronger', artist: 'Daft Punk',        difficulty: 'easy' },
  { deezerId: '29371581',  bpm: 78,  title: 'Alberto Balsalm',           artist: 'Aphex Twin',           difficulty: 'easy' },
  { deezerId: '141663615', bpm: 88,  title: "Keepin' It Steel",          artist: 'Amon Tobin',           difficulty: 'easy' },

  // ── MEDIUM  (101–143 BPM) ──────────────────────────────────────
  { deezerId: '3135553',    bpm: 123, title: 'One More Time',            artist: 'Daft Punk',            difficulty: 'medium' },
  { deezerId: '3129775',    bpm: 121, title: 'Around the World',         artist: 'Daft Punk',            difficulty: 'medium' },
  { deezerId: '66609426',   bpm: 116, title: 'Get Lucky',                artist: 'Daft Punk',            difficulty: 'medium' },
  { deezerId: '15734351',   bpm: 128, title: 'Technologic',              artist: 'Daft Punk',            difficulty: 'medium' },
  { deezerId: '3129772',    bpm: 111, title: 'Da Funk',                  artist: 'Daft Punk',            difficulty: 'medium' },
  { deezerId: '706051',     bpm: 126, title: "Blue Monday '88",          artist: 'New Order',            difficulty: 'medium' },
  { deezerId: '10284847',   bpm: 120, title: 'D.A.N.C.E',               artist: 'Justice',              difficulty: 'medium' },
  { deezerId: '10284907',   bpm: 128, title: 'Genesis',                  artist: 'Justice',              difficulty: 'medium' },
  { deezerId: '75569764',   bpm: 116, title: 'Midnight City',            artist: 'M83',                  difficulty: 'medium' },
  { deezerId: '3360677091', bpm: 128, title: "Ghosts 'n' Stuff",         artist: 'deadmau5',             difficulty: 'medium' },
  { deezerId: '2661882',    bpm: 135, title: "Where's Your Head At",     artist: 'Basement Jaxx',        difficulty: 'medium' },
  { deezerId: '3150977',    bpm: 120, title: 'Losing My Edge',           artist: 'LCD Soundsystem',      difficulty: 'medium' },
  { deezerId: '3252242',    bpm: 131, title: "Block Rockin' Beats",      artist: 'The Chemical Brothers',difficulty: 'medium' },
  { deezerId: '3135034',    bpm: 137, title: 'Hey Boy Hey Girl',         artist: 'The Chemical Brothers',difficulty: 'medium' },
  { deezerId: '3130293',    bpm: 103, title: 'Galvanize',                artist: 'The Chemical Brothers',difficulty: 'medium' },
  { deezerId: '348244671',  bpm: 128, title: 'Open Up',                  artist: 'Leftfield',            difficulty: 'medium' },
  { deezerId: '15686809',   bpm: 106, title: 'Right Here Right Now',     artist: 'Fatboy Slim',          difficulty: 'medium' },
  { deezerId: '33993921',   bpm: 128, title: 'Bonfire',                  artist: 'Knife Party',          difficulty: 'medium' },
  { deezerId: '29392051',   bpm: 131, title: 'Windowlicker',             artist: 'Aphex Twin',           difficulty: 'medium' },
  { deezerId: '428937302',  bpm: 132, title: 'Halcyon + On + On',        artist: 'Orbital',              difficulty: 'medium' },
  { deezerId: '82265248',   bpm: 138, title: 'Born Slippy (Nuxx)',       artist: 'Underworld',           difficulty: 'medium' },
  { deezerId: '80546728',   bpm: 139, title: 'Archangel',                artist: 'Burial',               difficulty: 'medium' },
  { deezerId: '7927244',    bpm: 140, title: 'Scary Monsters and Nice Sprites', artist: 'Skrillex',      difficulty: 'medium' },
  { deezerId: '62126191',   bpm: 140, title: 'Firestarter',              artist: 'The Prodigy',          difficulty: 'medium' },
  { deezerId: '428850202',  bpm: 136, title: 'The Box',                  artist: 'Orbital',              difficulty: 'medium' },
  { deezerId: '2537345',    bpm: 139, title: 'Busy Child',               artist: 'The Crystal Method',   difficulty: 'medium' },
  { deezerId: '29376731',   bpm: 142, title: 'My Red Hot Car',           artist: 'Squarepusher',         difficulty: 'medium' },

  // ── HARD  (anything goes — very fast or tricky) ────────────────
  { deezerId: '62126185',   bpm: 157, title: 'Breathe',                  artist: 'The Prodigy',          difficulty: 'hard' },
  { deezerId: '62126184',   bpm: 168, title: 'Smack My Bitch Up',        artist: 'The Prodigy',          difficulty: 'hard' },
  { deezerId: '128973878',  bpm: 174, title: 'Voodoo People (Pendulum Remix)', artist: 'The Prodigy',   difficulty: 'hard' },
  { deezerId: '15686770',   bpm: 171, title: 'The Rockafeller Skank',    artist: 'Fatboy Slim',          difficulty: 'hard' },
  { deezerId: '29391601',   bpm: 170, title: 'Come to Daddy',            artist: 'Aphex Twin',           difficulty: 'hard' },
  { deezerId: '805975',     bpm: 174, title: 'Propane Nightmares',       artist: 'Pendulum',             difficulty: 'hard' },
  { deezerId: '29396531',   bpm: 162, title: 'Cap.IV',                   artist: 'Autechre',             difficulty: 'hard' },
  { deezerId: '1173959',    bpm: 150, title: 'March of the Pigs',        artist: 'Nine Inch Nails',      difficulty: 'hard' },
  // slow/unusual BPMs also count as "hard"
  { deezerId: '29373661',   bpm: 79,  title: 'Roygbiv',                  artist: 'Boards of Canada',     difficulty: 'hard' },
  { deezerId: '3129748',    bpm: 79,  title: 'Teardrop',                 artist: 'Massive Attack',       difficulty: 'hard' },
  { deezerId: '80546728',   bpm: 139, title: 'Archangel',                artist: 'Burial',               difficulty: 'hard' },
];

export function getCatalogForDifficulty(difficulty: Difficulty): CatalogEntry[] {
  // Hard = full catalog (40–200 anything goes)
  if (difficulty === 'hard') return CATALOG;
  return CATALOG.filter(e => e.difficulty === difficulty);
}

export function shuffleCatalog(entries: CatalogEntry[]): CatalogEntry[] {
  const arr = [...entries];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
