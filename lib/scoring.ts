export interface RoundScore {
  round: number;
  trackId: string;
  actualBpm: number;
  guessBpm: number;
  accuracyPercent: number;
  accuracyScore: number;
  speedBonus: number;
  total: number;
  elapsedSeconds: number;
}

export const TIME_LIMIT = 20; // seconds

export function calculateRoundScore(
  guessBpm: number,
  actualBpm: number,
  elapsedSeconds: number,
  round: number,
  trackId: string
): RoundScore {
  const diff = Math.abs(guessBpm - actualBpm);
  const accuracyPercent = Math.max(0, (1 - diff / actualBpm)) * 100;
  const accuracyScore = 1000 * (accuracyPercent / 100);
  const speedBonus = Math.max(0, 500 * (1 - elapsedSeconds / TIME_LIMIT));
  const total = Math.round(accuracyScore + speedBonus);

  return {
    round,
    trackId,
    actualBpm,
    guessBpm,
    accuracyPercent,
    accuracyScore,
    speedBonus,
    total,
    elapsedSeconds,
  };
}

export function summarizeGame(rounds: RoundScore[]) {
  const totalScore = rounds.reduce((sum, r) => sum + r.total, 0);
  const avgAccuracy = rounds.reduce((sum, r) => sum + r.accuracyPercent, 0) / rounds.length;
  const best = rounds.reduce((best, r) => r.total > best.total ? r : best, rounds[0]);
  const worst = rounds.reduce((worst, r) => r.total < worst.total ? r : worst, rounds[0]);
  return { totalScore, avgAccuracy, best, worst };
}
