"use client";

import { useEffect, useRef } from "react";

const ASCII_CHARS = "X8@#OS0$x8@#os0$BbDdGgHhKkMmNnPpQqRrTtVvWwYyZzAaEeIiUu+=-_.,:;!?/|\\[]{}()^&*%~`";

const getSecureRandom = (() => {
  let seed = 123456789;
  let buffer: Uint32Array | null = null;
  let bufferIndex = 0;

  return () => {
    if (typeof window !== "undefined") {
      const crypto = window.crypto || (window as Window & { msCrypto?: Crypto }).msCrypto;
      if (crypto) {
        if (!buffer) {
          buffer = new Uint32Array(1024);
          bufferIndex = 1024;
        }
        if (bufferIndex >= 1024) {
          crypto.getRandomValues(buffer);
          bufferIndex = 0;
        }
        return buffer[bufferIndex++] / 4294967296;
      }
    }

    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
})();

function randomChar() {
  return ASCII_CHARS[Math.floor(getSecureRandom() * ASCII_CHARS.length)];
}

export function AsciiStrip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const gridRef = useRef<string[][]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const FONT_SIZE = 11;
    const LINE_HEIGHT = 14;

    function resize() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w;
      canvas!.height = h;

      const cols = Math.ceil(w / (FONT_SIZE * 0.6));
      const rows = Math.ceil(h / LINE_HEIGHT);

      gridRef.current = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, randomChar)
      );
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const FONT_SIZE_PX = FONT_SIZE;
      const CHAR_W = FONT_SIZE_PX * 0.6;

      ctx.clearRect(0, 0, w, h);
      ctx.font = `${FONT_SIZE_PX}px 'Courier New', monospace`;

      const rows = gridRef.current.length;
      const cols = gridRef.current[0]?.length ?? 0;

      tickRef.current++;
      if (tickRef.current % 2 === 0) {
        const mutations = Math.floor(cols * rows * 0.08);
        for (let m = 0; m < mutations; m++) {
          const r = Math.floor(getSecureRandom() * rows);
          const c = Math.floor(getSecureRandom() * cols);
          gridRef.current[r][c] = randomChar();
        }
      }

      for (let r = 0; r < rows; r++) {
        const rowProgress = r / (rows - 1); 
        const baseAlpha = 0.15 + rowProgress * 0.65; 

        for (let c = 0; c < cols; c++) {
          const alpha = Math.min(1, baseAlpha + (getSecureRandom() - 0.5) * 0.1);
          const brightness = 160 + Math.floor(rowProgress * 80);
          ctx.fillStyle = `rgba(${brightness - 40}, ${brightness - 80}, ${brightness + 20}, ${alpha})`;
          ctx.fillText(
            gridRef.current[r][c],
            c * CHAR_W,
            r * LINE_HEIGHT + FONT_SIZE_PX
          );
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none z-5 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), " +
            "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), " +
            "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
          WebkitMaskComposite: "source-in",
        }}
      />
    </div>
  );
}
