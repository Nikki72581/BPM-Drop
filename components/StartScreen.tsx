'use client';
import { useState } from 'react';
import Logo from './Logo';
import type { Difficulty } from '../lib/tracks';

interface StartScreenProps {
  onStart: (difficulty: Difficulty, playerName: string) => void;
  loading?: boolean;
}

const DIFFICULTIES: { key: Difficulty; label: string; range: string; desc: string }[] = [
  { key: 'easy', label: 'Easy', range: '60–100 BPM', desc: 'Pop, hip-hop, ballads' },
  { key: 'medium', label: 'Medium', range: '80–140 BPM', desc: 'Broader genres' },
  { key: 'hard', label: 'Hard', range: '40–200 BPM', desc: 'Anything goes' },
];

export default function StartScreen({ onStart, loading = false }: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [name, setName] = useState('');

  return (
    <div
      className="fade-slide-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px 40px',
        gap: '32px',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <Logo size="lg" />
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginTop: '12px',
        }}>
          Guess the BPM
        </p>
      </div>

      {/* Difficulty */}
      <div style={{ width: '100%' }}>
        <p style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '12px',
          textAlign: 'center',
        }}>
          Select Difficulty
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className="btn-active"
              style={{
                flex: 1,
                padding: '14px 8px',
                background: difficulty === d.key
                  ? 'rgba(0,255,200,0.08)'
                  : 'rgba(255,255,255,0.03)',
                border: difficulty === d.key
                  ? '1px solid rgba(0,255,200,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: difficulty === d.key ? '#00ffc8' : 'rgba(255,255,255,0.6)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                {d.label}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: difficulty === d.key ? 'rgba(0,255,200,0.6)' : 'rgba(255,255,255,0.25)',
              }}>
                {d.range}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                marginTop: '2px',
              }}>
                {d.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Username */}
      <div style={{ width: '100%' }}>
        <p style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Your Name
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value.slice(0, 20))}
          placeholder="anonymous"
          maxLength={20}
          style={{
            width: '100%',
            height: '44px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            padding: '0 14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(0,255,200,0.4)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.10)';
          }}
        />
      </div>

      {/* Start button */}
      <button
        onClick={() => !loading && onStart(difficulty, name.trim() || 'anonymous')}
        disabled={loading}
        className="btn-active"
        style={{
          width: '100%',
          height: '56px',
          background: loading ? 'rgba(0,255,200,0.3)' : 'linear-gradient(135deg, #00ffc8, #00cc9e)',
          border: 'none',
          borderRadius: '8px',
          color: '#0a0a12',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '14px',
          fontWeight: 900,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: loading ? 'none' : '0 0 30px rgba(0,255,200,0.2)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!loading) (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(0,255,200,0.35)';
        }}
        onMouseLeave={e => {
          if (!loading) (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,255,200,0.2)';
        }}
      >
        {loading ? 'Loading Tracks...' : 'Start Game'}
      </button>

      {/* Footer hint */}
      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>
        10 rounds · max 15,000 pts · spacebar to tap
      </p>
    </div>
  );
}
