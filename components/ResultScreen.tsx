'use client';
import type { RoundScore } from '../lib/scoring';
import type { Track } from '../lib/tracks';

interface ResultScreenProps {
  roundScore: RoundScore;
  track: Track;
  guess: number;
  round: number;
  totalScore: number;
  isLastRound: boolean;
  onNext: () => void;
}

function StatCard({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="card-reveal"
      style={{
        flex: 1,
        padding: '16px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        textAlign: 'center',
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
      }}
    >
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '9px',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '22px',
        fontWeight: 900,
        color,
      }}>
        {value}
      </div>
    </div>
  );
}

export default function ResultScreen({
  roundScore,
  track,
  guess,
  round,
  totalScore,
  isLastRound,
  onNext,
}: ResultScreenProps) {
  const off = Math.abs(guess - track.bpm);
  const perfect = off === 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '520px',
      margin: '0 auto',
      width: '100%',
      padding: '40px 24px',
      gap: '28px',
      alignItems: 'center',
    }}>
      {/* Actual BPM reveal */}
      <div className="fade-slide-up" style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Actual BPM
        </p>
        <div
          className="score-pop glow-cyan"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '64px',
            fontWeight: 900,
            color: '#00ffc8',
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          {track.bpm}
        </div>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          marginTop: '10px',
        }}>
          Your guess: <span style={{ color: '#fff' }}>{guess || '—'}</span>
          {guess > 0 && (
            <>
              {' '}·{' '}
              <span style={{ color: perfect ? '#00ffc8' : off <= 3 ? '#ffaa00' : 'rgba(255,255,255,0.6)' }}>
                {perfect ? 'Perfect!' : `Off by ${off}`}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Stat cards */}
      <div
        className="fade-slide-up fade-slide-up-delay-1"
        style={{ display: 'flex', gap: '8px', width: '100%' }}
      >
        <StatCard
          label="Accuracy"
          value={`${Math.round(roundScore.accuracyPercent)}%`}
          color="#00ffc8"
          delay={0.1}
        />
        <StatCard
          label="Speed Bonus"
          value={`+${Math.round(roundScore.speedBonus)}`}
          color="#b44aff"
          delay={0.2}
        />
        <StatCard
          label="Round Total"
          value={roundScore.total.toLocaleString()}
          color="#ffaa00"
          delay={0.3}
        />
      </div>

      {/* Running total */}
      <div
        className="fade-slide-up fade-slide-up-delay-2"
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'rgba(0,255,200,0.04)',
          border: '1px solid rgba(0,255,200,0.1)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          Total Score after Round {round}
        </span>
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          color: '#00ffc8',
        }}>
          {totalScore.toLocaleString()}
        </span>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        className="btn-active fade-slide-up fade-slide-up-delay-3"
        style={{
          width: '100%',
          height: '52px',
          background: isLastRound
            ? 'linear-gradient(135deg, #b44aff, #8822cc)'
            : 'rgba(255,255,255,0.06)',
          border: isLastRound
            ? 'none'
            : '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          color: isLastRound ? '#fff' : 'rgba(255,255,255,0.7)',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        {isLastRound ? 'See Final Score' : `Next Track →`}
      </button>
    </div>
  );
}
