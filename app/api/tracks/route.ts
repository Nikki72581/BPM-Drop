import { NextRequest, NextResponse } from 'next/server';
import type { Difficulty } from '../../../lib/tracks';

const FREESOUND_BASE = 'https://freesound.org/apiv2';

const BPM_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy:   { min: 60,  max: 100 },
  medium: { min: 80,  max: 140 },
  hard:   { min: 40,  max: 200 },
};

interface FreesoundTrack {
  id: number;
  name: string;
  duration: number;
  bpm: number | null;
  previews: {
    'preview-hq-mp3': string;
    'preview-lq-mp3': string;
  };
  tags: string[];
  username: string;
}

interface FreesoundResponse {
  count: number;
  results: FreesoundTrack[];
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'FREESOUND_API_KEY not configured' },
      { status: 500 }
    );
  }

  const difficulty = (req.nextUrl.searchParams.get('difficulty') ?? 'medium') as Difficulty;
  const { min, max } = BPM_RANGES[difficulty] ?? BPM_RANGES.medium;

  // Electronic music query with BPM and duration filters
  // Request more than we need so we can filter for valid BPM
  const params = new URLSearchParams({
    token: apiKey,
    query: 'electronic',
    filter: `bpm:[${min} TO ${max}] duration:[10 TO 60] type:wav OR type:mp3`,
    fields: 'id,name,duration,bpm,previews,tags,username',
    sort: 'score',
    page_size: '50',
    format: 'json',
  });

  try {
    const res = await fetch(`${FREESOUND_BASE}/search/text/?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // cache 1hr
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Freesound API error:', res.status, text);
      return NextResponse.json({ error: `Freesound error: ${res.status}` }, { status: 502 });
    }

    const data: FreesoundResponse = await res.json();

    // Filter: must have numeric BPM in range, duration 10–60s, and a preview URL
    const valid = data.results
      .filter(t =>
        typeof t.bpm === 'number' &&
        t.bpm >= min &&
        t.bpm <= max &&
        t.duration >= 10 &&
        t.duration <= 60 &&
        t.previews?.['preview-hq-mp3']
      )
      .slice(0, 25)
      .map(t => ({
        id:        String(t.id),
        title:     t.name.replace(/\.[^.]+$/, ''), // strip file extension from title
        bpm:       Math.round(t.bpm!),
        audioUrl:  t.previews['preview-hq-mp3'],
        duration:  Math.round(t.duration),
        genre:     'electronic',
        difficulty,
        tags:      t.tags.slice(0, 5),
        artist:    t.username,
      }));

    // If not enough results, relax filter and try again with a broader query
    if (valid.length < 10) {
      const broadParams = new URLSearchParams({
        token: apiKey,
        query: 'music loop beat',
        filter: `bpm:[${min} TO ${max}] duration:[10 TO 60]`,
        fields: 'id,name,duration,bpm,previews,tags,username',
        sort: 'downloads',
        page_size: '50',
        format: 'json',
      });

      const broadRes = await fetch(`${FREESOUND_BASE}/search/text/?${broadParams}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      });

      if (broadRes.ok) {
        const broadData: FreesoundResponse = await broadRes.json();
        const extra = broadData.results
          .filter(t =>
            typeof t.bpm === 'number' &&
            t.bpm >= min &&
            t.bpm <= max &&
            t.duration >= 10 &&
            t.previews?.['preview-hq-mp3'] &&
            !valid.find(v => v.id === String(t.id))
          )
          .map(t => ({
            id:        String(t.id),
            title:     t.name.replace(/\.[^.]+$/, ''),
            bpm:       Math.round(t.bpm!),
            audioUrl:  t.previews['preview-hq-mp3'],
            duration:  Math.round(t.duration),
            genre:     'electronic',
            difficulty,
            tags:      t.tags.slice(0, 5),
            artist:    t.username,
          }));

        valid.push(...extra);
      }
    }

    if (valid.length === 0) {
      return NextResponse.json({ error: 'No tracks found for this difficulty' }, { status: 404 });
    }

    // Shuffle before returning
    for (let i = valid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [valid[i], valid[j]] = [valid[j], valid[i]];
    }

    return NextResponse.json(valid.slice(0, 25));
  } catch (err) {
    console.error('Tracks fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
