'use client';
import type { LeaderboardEntry } from '../lib/leaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const RANK_COLORS = ['#ffaa00', 'rgba(255,255,255,0.5)', '#d87a3c'];

export default function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '24px',
        color: 'rgba(255,255,255,0.2)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
      }}>
        No scores yet — be the first!
      </div>
    );
  }

  return (
    <div>
      {entries.map((entry, i) => (
        <div
          key={`${entry.name}-${i}`}
          className="lb-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            gap: '12px',
          }}
        >
          {/* Rank */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: RANK_COLORS[i] ?? 'rgba(255,255,255,0.3)',
            minWidth: '24px',
            textAlign: 'center',
          }}>
            {i + 1}
          </div>

          {/* Name + difficulty */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {entry.name || 'anonymous'}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '1px',
            }}>
              {entry.difficulty}
            </div>
          </div>

          {/* Score */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '15px',
            fontWeight: 700,
            color: '#00ffc8',
            letterSpacing: '0.5px',
          }}>
            {entry.score.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
