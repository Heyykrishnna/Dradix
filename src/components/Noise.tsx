"use client";

import React, { useRef, useEffect } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      const randomValues = new Uint8Array(canvasSize * canvasSize);
      if (typeof window !== "undefined") {
        const crypto = window.crypto || (window as any).msCrypto;
        if (crypto) {
          crypto.getRandomValues(randomValues);
        } else {
          for (let i = 0; i < randomValues.length; i++) {
            randomValues[i] = Math.random() * 255;
          }
        }
      } else {
        try {
          const cryptoModule = eval("require")("crypto");
          const buf = cryptoModule.randomBytes(randomValues.length);
          for (let i = 0; i < randomValues.length; i++) {
            randomValues[i] = buf[i];
          }
        } catch {
          for (let i = 0; i < randomValues.length; i++) {
            randomValues[i] = Math.random() * 255;
          }
        }
      }

      for (let i = 0; i < data.length; i += 4) {
        const value = randomValues[i >> 2];
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      className="pointer-events-none absolute top-0 left-0 h-screen w-screen"
      ref={grainRef}
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default Noise;
