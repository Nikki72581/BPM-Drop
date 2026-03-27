'use client';
import { useEffect, useRef } from 'react';

interface BpmInputProps {
  value: string;
  onChange: (v: string) => void;
  onLockIn: () => void;
  disabled?: boolean;
}

export default function BpmInput({ value, onChange, onLockIn, disabled }: BpmInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when digit keys pressed (handled by parent, just ensure focus works)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter') {
        onLockIn();
        return;
      }
      // If digit pressed and not focused on an input, focus our input
      if (/^[0-9]$/.test(e.key) && document.activeElement?.tagName !== 'INPUT') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onLockIn, disabled]);

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        ref={inputRef}
        type="number"
        min={20}
        max={300}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder="BPM"
        style={{
          flex: 1,
          height: '52px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          textAlign: 'center',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          padding: '0 12px',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#00ffc8';
          e.target.style.boxShadow = '0 0 0 1px rgba(0,255,200,0.2)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(255,255,255,0.12)';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        onClick={onLockIn}
        disabled={disabled || !value}
        className="btn-active"
        style={{
          height: '52px',
          padding: '0 20px',
          background: (!disabled && value)
            ? 'linear-gradient(135deg, #00ffc8, #00cc9e)'
            : 'rgba(255,255,255,0.06)',
          border: 'none',
          borderRadius: '8px',
          color: (!disabled && value) ? '#0a0a12' : 'rgba(255,255,255,0.2)',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          cursor: (!disabled && value) ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        Lock In
      </button>
    </div>
  );
}
