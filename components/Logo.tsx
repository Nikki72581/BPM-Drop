'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: { bpm: 'text-lg', drop: 'text-lg' },
    md: { bpm: 'text-2xl', drop: 'text-2xl' },
    lg: { bpm: 'text-5xl', drop: 'text-5xl' },
  };

  return (
    <span
      className={`font-['Orbitron'] font-black tracking-wider logo-flicker select-none ${sizes[size].bpm}`}
      style={{ fontFamily: 'Orbitron, sans-serif' }}
    >
      <span className="glow-cyan" style={{ color: '#00ffc8' }}>BPM</span>
      <span className="glow-purple" style={{ color: '#b44aff' }}> DROP</span>
    </span>
  );
}
