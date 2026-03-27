import type { Difficulty } from './tracks';

export interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: string;
}

const STORAGE_KEY = 'bpm-drop-leaderboard';

export function getLocalLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries: LeaderboardEntry[] = JSON.parse(raw);
    return entries.sort((a, b) => b.score - a.score).slice(0, 10);
  } catch {
    return [];
  }
}

export function saveLocalScore(entry: LeaderboardEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalLeaderboard();
    const updated = [...current, entry].sort((a, b) => b.score - a.score).slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to local
  }
  return getLocalLeaderboard();
}

export async function submitScore(entry: LeaderboardEntry): Promise<void> {
  // Always save locally as a backup
  saveLocalScore(entry);

  try {
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch {
    // silently fall back to local-only
  }
}
