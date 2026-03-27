import { NextRequest, NextResponse } from 'next/server';
import { getCatalogForDifficulty, shuffleCatalog } from '../../../lib/catalog';
import type { Difficulty } from '../../../lib/tracks';

const DEEZER_BASE = 'https://api.deezer.com';

interface DeezerTrackResponse {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: { name: string };
  album: { title: string; cover_medium: string };
  error?: { type: string; message: string };
}

async function fetchDeezerTrack(id: string): Promise<DeezerTrackResponse | null> {
  try {
    const res = await fetch(`${DEEZER_BASE}/track/${id}`, {
      next: { revalidate: 1800 }, // cache 30 min (preview URLs expire ~1hr)
    });
    if (!res.ok) return null;
    const data: DeezerTrackResponse = await res.json();
    if (data.error || !data.preview) return null;
    return data;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const difficulty = (req.nextUrl.searchParams.get('difficulty') ?? 'medium') as Difficulty;

  const catalog = shuffleCatalog(getCatalogForDifficulty(difficulty));

  // Pick enough candidates (fetch more than 10 to cover any that return no preview)
  const candidates = catalog.slice(0, 20);

  // Fetch Deezer track details in parallel to get fresh preview URLs
  const results = await Promise.all(
    candidates.map(async (entry) => {
      const track = await fetchDeezerTrack(entry.deezerId);
      if (!track) return null;
      return {
        id:       entry.deezerId,
        title:    entry.title,
        bpm:      entry.bpm,
        audioUrl: track.preview,
        duration: track.duration,
        genre:    'electronic',
        difficulty,
        artist:   entry.artist,
        album:    track.album?.title ?? '',
        artwork:  track.album?.cover_medium ?? '',
      };
    })
  );

  const tracks = results.filter(Boolean);

  if (tracks.length === 0) {
    return NextResponse.json(
      { error: 'Could not load any tracks from Deezer. Try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json(tracks);
}
