'use client';
import { useEffect, useRef } from 'react';

interface WaveformProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
}

const BAR_COUNT = 60;

export default function Waveform({ analyserNode, isPlaying }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const barsRef = useRef<number[]>(new Array(BAR_COUNT).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (analyserNode && isPlaying) {
        const bufLen = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufLen);
        analyserNode.getByteFrequencyData(data);

        // Map frequency bins to BAR_COUNT bars
        for (let i = 0; i < BAR_COUNT; i++) {
          const start = Math.floor((i / BAR_COUNT) * bufLen);
          const end = Math.floor(((i + 1) / BAR_COUNT) * bufLen);
          let sum = 0;
          for (let j = start; j < end; j++) sum += data[j];
          const avg = sum / (end - start);
          const target = 10 + (avg / 255) * 60;
          // Lerp toward target
          barsRef.current[i] = barsRef.current[i] * 0.7 + target * 0.3;
        }
      } else {
        // Idle animation: subtle wave
        const t = Date.now() / 1000;
        for (let i = 0; i < BAR_COUNT; i++) {
          const wave = Math.sin(t * 1.5 + i * 0.3) * 0.5 + 0.5;
          const target = 4 + wave * 6;
          barsRef.current[i] = barsRef.current[i] * 0.85 + target * 0.15;
        }
      }

      const barW = 3;
      const gap = (w - BAR_COUNT * barW) / (BAR_COUNT - 1);
      const step = barW + gap;

      for (let i = 0; i < BAR_COUNT; i++) {
        const barH = barsRef.current[i];
        const x = i * step;
        const y = (h - barH) / 2;

        if (isPlaying) {
          ctx.fillStyle = '#00ffc8';
          ctx.globalAlpha = 0.85;
        } else {
          ctx.fillStyle = '#00ffc8';
          ctx.globalAlpha = 0.15;
        }

        // Rounded rect
        ctx.beginPath();
        const r = Math.min(2, barH / 2);
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, y + barH - r);
        ctx.quadraticCurveTo(x + barW, y + barH, x + barW - r, y + barH);
        ctx.lineTo(x + r, y + barH);
        ctx.quadraticCurveTo(x, y + barH, x, y + barH - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [analyserNode, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={80}
      style={{ width: '100%', height: '80px' }}
    />
  );
}
