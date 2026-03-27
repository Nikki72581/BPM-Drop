'use client';

interface TimerBarProps {
  progress: number; // 0–1 (how much has elapsed)
  remaining: number; // seconds
}

export default function TimerBar({ progress, remaining }: TimerBarProps) {
  const isUrgent = remaining <= 5;
  const fillWidth = Math.max(0, Math.min(100, (1 - progress) * 100));

  return (
    <div>
      <div
        style={{
          height: '3px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          className={isUrgent ? 'timer-urgent' : ''}
          style={{
            height: '100%',
            width: `${fillWidth}%`,
            background: isUrgent
              ? '#ff4444'
              : 'linear-gradient(90deg, #00ffc8, #b44aff)',
            transition: 'width 0.1s linear',
            borderRadius: '2px',
          }}
        />
      </div>
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: isUrgent ? '#ff4444' : 'rgba(255,255,255,0.4)',
          marginTop: '6px',
          textAlign: 'right',
          letterSpacing: '0.5px',
        }}
      >
        {Math.ceil(remaining)}s remaining
      </p>
    </div>
  );
}
