export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Track {
  id: string;
  title: string;
  bpm: number;
  audioUrl: string;
  duration: number;
  genre: string;
  difficulty: Difficulty;
  artist?: string;
  album?: string;
  artwork?: string;
}

export function shuffleTracks(tracks: Track[]): Track[] {
  const arr = [...tracks];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function fetchTracksForDifficulty(difficulty: Difficulty): Promise<Track[]> {
  const res = await fetch(`/api/tracks?difficulty=${difficulty}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to fetch tracks (${res.status})`);
  }
  return res.json();
}

export function selectRoundTracks(tracks: Track[], count = 10): Track[] {
  const shuffled = shuffleTracks(tracks);
  if (shuffled.length >= count) return shuffled.slice(0, count);
  const result: Track[] = [];
  while (result.length < count) {
    result.push(...shuffled.slice(0, count - result.length));
  }
  return result;
}
