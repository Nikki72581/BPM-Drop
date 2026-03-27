'use client';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import Leaderboard from './Leaderboard';
import { fetchLeaderboard, submitScore } from '../lib/leaderboard';
import type { LeaderboardEntry } from '../lib/leaderboard';
import type { RoundScore } from '../lib/scoring';
import type { Difficulty } from '../lib/tracks';

interface GameOverScreenProps {
  score: number;
  rounds: RoundScore[];
  difficulty: Difficulty;
  playerName: string;
  onPlayAgain: () => void;
}

export default function GameOverScreen({
  score,
  rounds,
  difficulty,
  playerName,
  onPlayAgain,
}: GameOverScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Stats
  const avgAccuracy = rounds.length > 0
    ? rounds.reduce((s, r) => s + r.accuracyPercent, 0) / rounds.length
    : 0;
  const bestRound = rounds.length > 0
    ? rounds.reduce((best, r) => r.total > best.total ? r : best, rounds[0])
    : null;

  const maxScore = 15000;
  const pct = Math.round((score / maxScore) * 100);

  const gradeLabel = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 55 ? 'B' : pct >= 35 ? 'C' : 'D';
  const gradeColor = pct >= 90 ? '#00ffc8' : pct >= 75 ? '#ffaa00' : pct >= 55 ? '#b44aff' : 'rgba(255,255,255,0.5)';

  useEffect(() => {
    const entry: LeaderboardEntry = {
      name: playerName,
      score,
      difficulty,
      date: new Date().toISOString(),
    };

    if (!submitted) {
      setSubmitted(true);
      submitScore(entry).then(() => {
        fetchLeaderboard().then(setLeaderboard);
      });
    }
  }, [score, difficulty, playerName, submitted]);

  const handleShare = async () => {
    const text = `🎵 BPM DROP — ${difficulty.toUpperCase()}\n` +
      `Score: ${score.toLocaleString()} / 15,000 (Grade ${gradeLabel})\n` +
      `Avg accuracy: ${Math.round(avgAccuracy)}%\n` +
      `Can you beat me?`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '520px',
      margin: '0 auto',
      width: '100%',
      padding: '32px 24px 48px',
      gap: '24px',
    }}>
      {/* Header */}
      <div className="fade-slide-up" style={{ textAlign: 'center' }}>
        <Logo size="sm" />
        <p style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginTop: '8px',
        }}>
          Game Over
        </p>
      </div>

      {/* Score + grade */}
      <div
        className="fade-slide-up fade-slide-up-delay-1"
        style={{
          textAlign: 'center',
          padding: '28px',
          background: 'rgba(0,255,200,0.03)',
          border: '1px solid rgba(0,255,200,0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Final Score
        </div>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '52px',
          fontWeight: 900,
          color: '#00ffc8',
          letterSpacing: '-1px',
          lineHeight: 1,
        }}
          className="glow-cyan score-pop"
        >
          {score.toLocaleString()}
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '6px',
        }}>
          / 15,000
        </div>

        {/* Grade badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          border: `2px solid ${gradeColor}`,
          borderRadius: '8px',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '28px',
          fontWeight: 900,
          color: gradeColor,
          marginTop: '16px',
        }}>
          {gradeLabel}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="fade-slide-up fade-slide-up-delay-2"
        style={{ display: 'flex', gap: '8px' }}
      >
        <div style={{
          flex: 1,
          padding: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Avg Accuracy
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#00ffc8' }}>
            {Math.round(avgAccuracy)}%
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Best Round
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#ffaa00' }}>
            {bestRound ? bestRound.total.toLocaleString() : '—'}
          </div>
        </div>
        <div style={{
          flex: 1,
          padding: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Difficulty
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#b44aff', textTransform: 'capitalize' }}>
            {difficulty}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="fade-slide-up fade-slide-up-delay-3" style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onPlayAgain}
          className="btn-active"
          style={{
            flex: 2,
            height: '52px',
            background: 'linear-gradient(135deg, #00ffc8, #00cc9e)',
            border: 'none',
            borderRadius: '8px',
            color: '#0a0a12',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
        <button
          onClick={handleShare}
          className="btn-active"
          style={{
            flex: 1,
            height: '52px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: copied ? '#00ffc8' : 'rgba(255,255,255,0.6)',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
        >
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Leaderboard */}
      <div className="fade-slide-up fade-slide-up-delay-4">
        <p style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Leaderboard
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <Leaderboard entries={leaderboard} />
        </div>
      </div>
    </div>
  );
}
