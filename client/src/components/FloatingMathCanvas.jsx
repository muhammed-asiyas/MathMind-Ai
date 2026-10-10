import { useEffect, useRef } from "react";

const MATH_SYMBOLS = [
  "π", "∑", "∫", "√x", "∞", "θ", "Δ", "λ", "f(x)", "≈", "±", "∂y",
  "x²", "÷", "∠", "Σ", "∇", "aⁿ", "≠", "∝", "∴", "μ", "β", "cos",
];
const MAX_DEVICE_PIXEL_RATIO = 2;

export default function FloatingMathCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frameId = 0;
    let previousFrame = 0;
    let visible = true;
    let glyphs = [];

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      glyphs = Array.from(
        { length: Math.min(22, Math.max(9, Math.floor(width / 82))) },
        (_, index) => ({
          text: MATH_SYMBOLS[index % MATH_SYMBOLS.length],
          x: Math.random() * width,
          y: Math.random() * height,
          drift: Math.random() * Math.PI * 2,
          speed: 0.12 + Math.random() * 0.2,
          size: 15 + Math.random() * 17,
          opacity: 0.14 + Math.random() * 0.16,
          rotation: (Math.random() - 0.5) * 0.24,
          color: index % 3 === 0 ? "cyan" : "indigo",
        }),
      );
      draw(0);
    };

    const draw = (elapsed) => {
      const isLight = document.documentElement.dataset.theme === "light";
      const delta = Math.min(elapsed / 16.67, 2);
      ctx.clearRect(0, 0, width, height);

      const points = glyphs.map((glyph) => {
        glyph.drift += glyph.speed * delta * 0.012;
        if (!reducedMotion.matches) {
          glyph.x += Math.sin(glyph.drift) * 0.24 * delta;
          glyph.y -= glyph.speed * delta;
          if (glyph.y < -32) {
            glyph.y = height + 30;
            glyph.x = Math.random() * width;
          }
          if (glyph.x < -32) glyph.x = width + 30;
          if (glyph.x > width + 32) glyph.x = -30;
        }
        return glyph;
      });

      for (let index = 0; index < points.length; index += 1) {
        const glyph = points[index];
        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const next = points[nextIndex];
          const dx = glyph.x - next.x;
          const dy = glyph.y - next.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 145) continue;

          ctx.beginPath();
          ctx.moveTo(glyph.x, glyph.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = isLight
            ? `rgba(148, 163, 184, ${(1 - distance / 145) * 0.1})`
            : `rgba(52, 211, 153, ${(1 - distance / 145) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        const rgb = isLight
          ? glyph.color === "cyan" ? "5, 150, 105" : "100, 116, 139"
          : glyph.color === "cyan" ? "52, 211, 153" : "16, 185, 129";
        ctx.save();
        ctx.translate(glyph.x, glyph.y);
        ctx.rotate(glyph.rotation + Math.sin(glyph.drift) * 0.045);
        ctx.font = `600 ${glyph.size}px "DM Sans", "Segoe UI", sans-serif`;
        ctx.fillStyle = `rgba(${rgb}, ${glyph.opacity})`;
        ctx.fillText(glyph.text, 0, 0);
        ctx.restore();
      }
    };

    const animate = (timestamp) => {
      if (!visible || reducedMotion.matches) {
        frameId = 0;
        return;
      }
      const elapsed = previousFrame ? timestamp - previousFrame : 16.67;
      previousFrame = timestamp;
      draw(elapsed);
      frameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!visible || reducedMotion.matches || frameId) return;
      previousFrame = 0;
      frameId = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      previousFrame = 0;
    };

    const handleMotionChange = () => {
      stopAnimation();
      draw(0);
      startAnimation();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    const themeObserver = new MutationObserver(() => draw(0));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startAnimation();
      else stopAnimation();
    });
    intersectionObserver.observe(container);
    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);
    reducedMotion.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resize();
    startAnimation();

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
