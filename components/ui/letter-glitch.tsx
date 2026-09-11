"use client";

import * as React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ────────────── LetterGlitch ──────────────
 * Fundo decorativo em canvas (caracteres soltos piscando em cores),
 * reaproveitado no ProcessingCard e na landing /resultado. */
export const LetterGlitch: React.FC<{
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
  className?: string;
}> = ({
  glitchColors = ["#00ff41", "#22ff88", "#4dffa3", "#8affc2", "#c2ffe0"],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = ".,:;-*#",
  className = "",
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | null>(null);
  const letters = React.useRef<
    Array<{ char: string; color: string; targetColor: string; colorProgress: number }>
  >([]);
  const grid = React.useRef({ columns: 0, rows: 0 });
  const context = React.useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = React.useRef(Date.now());

  const lettersAndSymbols = React.useMemo(() => Array.from(characters), [characters]);
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = React.useCallback(
    () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
    [lettersAndSymbols],
  );
  const getRandomColor = React.useCallback(
    () => glitchColors[Math.floor(Math.random() * glitchColors.length)],
    [glitchColors],
  );

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const normalized = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number,
  ) =>
    `rgb(${Math.round(start.r + (end.r - start.r) * factor)},${Math.round(
      start.g + (end.g - start.g) * factor,
    )},${Math.round(start.b + (end.b - start.b) * factor)})`;

  const calculateGrid = (width: number, height: number) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  });

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const total = columns * rows;
    letters.current = Array.from({ length: total }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    if (!context.current || !canvasRef.current) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";
    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));
    for (let i = 0; i < updateCount; i++) {
      const idx = Math.floor(Math.random() * letters.current.length);
      const item = letters.current[idx];
      item.char = getRandomChar();
      item.targetColor = getRandomColor();
      if (!smooth) {
        item.color = item.targetColor;
        item.colorProgress = 1;
      } else {
        item.colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        letter.colorProgress = Math.min(1, letter.colorProgress + 0.05);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });
    if (needsRedraw) drawLetters();
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }
    if (smooth) handleSmoothTransitions();
    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    if (context.current) context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    context.current = canvas.getContext("2d");
    resizeCanvas();
    animate();

    let resizeTimeout: number | undefined;
    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth]);

  return (
    <div className={cn("relative w-full h-full bg-black overflow-hidden", className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]" />
      )}
      {centerVignette && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" />
      )}
    </div>
  );
};
