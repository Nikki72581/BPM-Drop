'use client';
import { useCallback, useRef, useState } from 'react';

const MAX_TAPS = 8;
const TAP_TIMEOUT_MS = 3000; // reset if no tap for 3s

export function useTapTempo() {
  const tapTimesRef = useRef<number[]>([]);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);
  const [tapCount, setTapCount] = useState(0);

  const tap = useCallback(() => {
    const now = Date.now();

    // Clear the reset timer
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    // Reset if last tap was too long ago
    const taps = tapTimesRef.current;
    if (taps.length > 0 && now - taps[taps.length - 1] > TAP_TIMEOUT_MS) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > MAX_TAPS) {
      tapTimesRef.current.shift();
    }

    setTapCount(c => c + 1);

    const current = tapTimesRef.current;
    if (current.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < current.length; i++) {
        intervals.push(current[i] - current[i - 1]);
      }
      const avg = intervals.reduce((s, v) => s + v, 0) / intervals.length;
      const calculated = Math.round(60000 / avg);
      // Clamp to reasonable range
      const clamped = Math.min(Math.max(calculated, 20), 300);
      setBpm(clamped);
    }

    // Auto-reset after timeout
    resetTimerRef.current = setTimeout(() => {
      tapTimesRef.current = [];
      setTapCount(0);
      setBpm(null);
    }, TAP_TIMEOUT_MS);
  }, []);

  const reset = useCallback(() => {
    tapTimesRef.current = [];
    setTapCount(0);
    setBpm(null);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  return { bpm, tap, reset, tapCount };
}
