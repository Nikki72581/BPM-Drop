'use client';
import { useRef, useState } from 'react';

interface TapTempoProps {
  bpm: number | null;
  onTap: () => void;
  tapCount: number;
}

export default function TapTempo({ bpm, onTap, tapCount }: TapTempoProps) {
  const [flashing, setFlashing] = useState(false);
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    onTap();
    setFlashing(true);
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setFlashing(false), 150);
  };

  return (
    <button
      onClick={handleTap}
      className="btn-active"
      style={{
        width: '100%',
        minHeight: '72px',
        background: flashing
          ? 'rgba(180, 74, 255, 0.15)'
          : 'rgba(180, 74, 255, 0.05)',
        border: '1px solid rgba(180, 74, 255, 0.3)',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        transition: 'background 0.1s ease',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {/* Left: icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Pulsing circle */}
        <div style={{ position: 'relative', width: '32px', height: '32px', flexShrink: 0 }}>
          {/* Ring */}
          <div
            className="pulse-ring"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid #b44aff',
              opacity: tapCount > 0 ? 1 : 0.5,
            }}
          />
          {/* Fill */}
          <div
            style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '50%',
              background: flashing ? '#b44aff' : 'rgba(180,74,255,0.4)',
              transition: 'background 0.1s ease',
            }}
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            color: '#b44aff',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Tap Tempo
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            marginTop: '2px',
          }}>
            {tapCount < 2 ? 'tap to measure BPM' : `${tapCount} taps`}
          </div>
        </div>
      </div>

      {/* Right: calculated BPM */}
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: bpm ? '28px' : '20px',
        fontWeight: 900,
        color: bpm ? '#b44aff' : 'rgba(180,74,255,0.3)',
        letterSpacing: bpm ? '1px' : '2px',
        minWidth: '80px',
        textAlign: 'right',
        transition: 'color 0.15s ease',
      }}>
        {bpm ?? '--'}
      </div>
    </button>
  );
}
