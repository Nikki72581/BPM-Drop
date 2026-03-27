'use client';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import Waveform from './Waveform';
import TapTempo from './TapTempo';
import BpmInput from './BpmInput';
import TimerBar from './TimerBar';
import { useTapTempo } from '../hooks/useTapTempo';
import { useTimer } from '../hooks/useTimer';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { calculateRoundScore, TIME_LIMIT } from '../lib/scoring';
import type { Track } from '../lib/tracks';
import type { RoundScore } from '../lib/scoring';

interface GameScreenProps {
  round: number;
  score: number;
  track: Track;
  onGuessSubmit: (roundScore: RoundScore, track: Track, guess: number) => void;
  onQuit: () => void;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GameScreen({ round, score, track, onGuessSubmit, onQuit }: GameScreenProps) {
  const [inputValue, setInputValue] = useState('');
  const [locked, setLocked] = useState(false);
  const { bpm: tapBpm, tap, reset: resetTap, tapCount } = useTapTempo();
  const audioEngine = useAudioEngine();
  const elapsedRef = useRef(0);
  const lockedRef = useRef(false);

  // Sync tap BPM to input
  useEffect(() => {
    if (tapBpm !== null && !lockedRef.current) {
      setInputValue(String(tapBpm));
    }
  }, [tapBpm]);

  const handleLockIn = (fromTimer = false) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    timer.stop();
    audioEngine.stop();

    const guess = parseInt(inputValue, 10) || 0;
    const elapsed = elapsedRef.current;
    const rs = calculateRoundScore(guess, track.bpm, elapsed, round, track.id);
    onGuessSubmit(rs, track, guess);
  };

  const handleTimerExpire = () => {
    if (!lockedRef.current) {
      handleLockIn(true);
    }
  };

  const timer = useTimer(TIME_LIMIT, handleTimerExpire);

  // Start audio + timer on mount
  useEffect(() => {
    lockedRef.current = false;
    setLocked(false);
    setInputValue('');
    resetTap();

    audioEngine.play(track.audioUrl, track.bpm);
    timer.start();

    return () => {
      audioEngine.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  // Track elapsed for scoring
  useEffect(() => {
    elapsedRef.current = timer.elapsed;
  }, [timer.elapsed]);

  // Spacebar handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (locked) return;
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tap, locked]);

  const audioDuration = 30;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '520px',
      margin: '0 auto',
      width: '100%',
      padding: '0 24px',
      gap: '0',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo size="sm" />
          <button
            onClick={() => { audioEngine.stop(); onQuit(); }}
            className="btn-active"
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              padding: '5px 10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,80,80,0.4)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,0.7)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)';
            }}
          >
            quit
          </button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}>
            Round <span style={{ color: '#00ffc8', fontWeight: 500 }}>{round}</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/10</span>
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#00ffc8',
            marginTop: '2px',
          }}>
            {score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Waveform area */}
      <div style={{
        padding: '20px 0 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          background: 'rgba(0,255,200,0.02)',
          border: '1px solid rgba(0,255,200,0.08)',
          borderRadius: '8px',
          padding: '16px 16px 12px',
        }}>
          <Waveform analyserNode={audioEngine.analyserNode} isPlaying={audioEngine.isPlaying} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%',
            }}>
              {track.artist ? `${track.artist} — ${track.genre}` : `Track #${round}`}
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {formatTime(audioEngine.currentTime)} / {formatTime(audioDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Input section */}
      <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Your Guess
        </p>

        <TapTempo bpm={tapBpm} onTap={tap} tapCount={tapCount} />

        {/* OR divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '2px',
          }}>
            OR
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <BpmInput
          value={inputValue}
          onChange={setInputValue}
          onLockIn={() => handleLockIn(false)}
          disabled={locked}
        />

        {/* Timer */}
        <div style={{ marginTop: '4px' }}>
          <TimerBar progress={timer.progress} remaining={timer.remaining} />
        </div>
      </div>
    </div>
  );
}
