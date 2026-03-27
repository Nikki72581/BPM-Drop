'use client';
import { useRef, useCallback, useEffect, useState } from 'react';

export interface AudioEngine {
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
  play: (audioUrl: string, bpm: number) => void;
  stop: () => void;
  currentTime: number;
}

export function useAudioEngine(): AudioEngine {
  const ctxRef = useRef<AudioContext | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const metronomeNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const durationRef = useRef<number>(30);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);

    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.src = '';
      audioElRef.current = null;
    }
    if (mediaSourceRef.current) {
      try { mediaSourceRef.current.disconnect(); } catch { /* ok */ }
      mediaSourceRef.current = null;
    }
    metronomeNodesRef.current.forEach(n => { try { n.stop(); } catch { /* ok */ } });
    metronomeNodesRef.current = [];

    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Generate a click/tick buffer for the fallback metronome
  const makeClickBuffer = useCallback((ctx: AudioContext, isAccent: boolean): AudioBuffer => {
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * 0.04);
    const buf = ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    const freq = isAccent ? 1200 : 800;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 80) * (isAccent ? 0.8 : 0.5);
    }
    return buf;
  }, []);

  const makeMetronomeStream = useCallback((
    ctx: AudioContext, bpm: number, dur: number, destination: GainNode
  ): AudioBufferSourceNode[] => {
    const interval = 60 / bpm;
    const accentBuf = makeClickBuffer(ctx, true);
    const tickBuf = makeClickBuffer(ctx, false);
    const nodes: AudioBufferSourceNode[] = [];
    let beat = 0;
    let t = ctx.currentTime + 0.05;
    while (t < ctx.currentTime + dur + 0.1) {
      const node = ctx.createBufferSource();
      node.buffer = beat % 4 === 0 ? accentBuf : tickBuf;
      node.connect(destination);
      node.start(t);
      nodes.push(node);
      t += interval;
      beat++;
    }
    return nodes;
  }, [makeClickBuffer]);

  const play = useCallback((audioUrl: string, bpm: number) => {
    stop();
    const ctx = getCtx();

    // Analyser
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;
    setAnalyserNode(analyser);

    // Gain
    const gain = ctx.createGain();
    gain.gain.value = 1;
    gainRef.current = gain;
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    startTimeRef.current = ctx.currentTime;
    durationRef.current = 30;

    const startTracking = (dur: number) => {
      durationRef.current = dur;
      setIsPlaying(true);
      const tick = () => {
        if (ctxRef.current) {
          const el = audioElRef.current;
          const elapsed = el ? el.currentTime : ctxRef.current.currentTime - startTimeRef.current;
          setCurrentTime(Math.min(elapsed, durationRef.current));
          if (elapsed < durationRef.current) {
            animFrameRef.current = requestAnimationFrame(tick);
          } else {
            setIsPlaying(false);
          }
        }
      };
      animFrameRef.current = requestAnimationFrame(tick);
    };

    // Use <audio> element + createMediaElementSource to handle remote URLs + CORS
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioElRef.current = audio;

    const setupAudioElement = () => {
      try {
        const mediaSource = ctx.createMediaElementSource(audio);
        mediaSource.connect(gain);
        mediaSourceRef.current = mediaSource;
        audio.play().catch(() => {
          // If play fails (autoplay blocked), still mark as playing
          // The user interaction that triggered play() should have unlocked autoplay
        });
        startTracking(audio.duration || 30);
        audio.addEventListener('durationchange', () => {
          if (audio.duration && isFinite(audio.duration)) {
            durationRef.current = audio.duration;
          }
        });
        audio.addEventListener('ended', () => setIsPlaying(false));
      } catch {
        // Fallback: metronome
        audio.src = '';
        audioElRef.current = null;
        metronomeNodesRef.current = makeMetronomeStream(ctx, bpm, 30, gain);
        startTracking(30);
      }
    };

    audio.addEventListener('canplay', setupAudioElement, { once: true });
    audio.addEventListener('error', () => {
      // Audio load failed — fall back to metronome
      audioElRef.current = null;
      metronomeNodesRef.current = makeMetronomeStream(ctx, bpm, 30, gain);
      startTracking(30);
    }, { once: true });

    audio.src = audioUrl;
    audio.load();
  }, [stop, getCtx, makeMetronomeStream]);

  useEffect(() => {
    return () => {
      stop();
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, [stop]);

  return { isPlaying, analyserNode, play, stop, currentTime };
}
