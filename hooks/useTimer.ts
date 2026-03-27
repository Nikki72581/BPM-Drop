'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(duration: number, onExpire: () => void) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const tick = useCallback(() => {
    const now = performance.now();
    const e = (now - startRef.current) / 1000;
    if (e >= duration) {
      setElapsed(duration);
      setRunning(false);
      onExpireRef.current();
    } else {
      setElapsed(e);
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [duration]);

  const start = useCallback(() => {
    setElapsed(0);
    startRef.current = performance.now();
    setRunning(true);
    frameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setElapsed(0);
    setRunning(false);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const remaining = Math.max(0, duration - elapsed);
  const progress = elapsed / duration; // 0–1

  return { elapsed, remaining, progress, running, start, stop, reset };
}
