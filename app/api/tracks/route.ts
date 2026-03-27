import { NextRequest, NextResponse } from 'next/server';
import type { Difficulty } from '../../../lib/tracks';

const DEEZER_BASE = 'https://api.deezer.com';

// Deezer genre IDs for electronic/dance music
// 106 = Electro, 113 = Dance, 116 = Electronic
const GENRE_QUERIES = [
  'electronic music',
  'techno',
  'house music',
  'drum and bass',
  'ambient electronic',
  'synthwave',
  'trance',
];

const BPM_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 60,  max: 105 },
  medium: { min: 90,  max: 145 },
  hard:   { min: 40,  max: 200 },
};

interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  bpm: number;
  preview: string;        // 30-second MP3 URL
  artist: { name: string };
  album: { title: string; cover_medium: string };
}

interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
}

async function fetchGenreQuery(query: string): Promise<DeezerTrack[]> {
  const url = `${DEEZER_BASE}/search?q=${encodeURIComponent(query)}&limit=50&output=json`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data: DeezerSearchResponse = await res.json();
  return data.data ?? [];
}

export async function GET(req: NextRequest) {
  const difficulty = (req.nextUrl.searchParams.get('difficulty') ?? 'medium') as Difficulty;
  const { min, max } = BPM_RANGES[difficulty];

  try {
    // Fetch across multiple queries in parallel to build a big pool
    const results = await Promise.all(GENRE_QUERIES.map(fetchGenreQuery));
    const allTracks = results.flat();

    // Deduplicate by id
    const seen = new Set<number>();
    const unique = allTracks.filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });

    // Filter: must have valid BPM in range, a preview URL, and reasonable duration
    const inRange = unique.filter(t =>
      typeof t.bpm === 'number' &&
      t.bpm >= min &&
      t.bpm <= max &&
      t.preview &&
      t.preview.startsWith('https://') &&
      t.duration >= 10
    );

    // If BPM-filtered pool is thin, fall back to using tracks with bpm > 0 and widen range
    let pool = inRange;
    if (pool.length < 10) {
      pool = unique.filter(t =>
        typeof t.bpm === 'number' &&
        t.bpm > 0 &&
        t.preview &&
        t.preview.startsWith('https://')
      );
    }

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const tracks = pool.slice(0, 25).map(t => ({
      id:        String(t.id),
      title:     t.title,
      bpm:       Math.round(t.bpm),
      audioUrl:  t.preview,
      duration:  t.duration,
      genre:     'electronic',
      difficulty,
      artist:    t.artist.name,
      album:     t.album.title,
      artwork:   t.album.cover_medium,
    }));

    if (tracks.length === 0) {
      return NextResponse.json({ error: 'No tracks found' }, { status: 404 });
    }

    return NextResponse.json(tracks);
  } catch (err) {
    console.error('Deezer fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
