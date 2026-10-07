import { useEffect, useRef } from "react";

const MATH_SYMBOLS = ["π", "∑", "∫", "√x", "∞", "θ", "Δ", "λ", "f(x)", "≈", "±", "∂y"];

export default function FloatingMathCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = null;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Track mouse coordinates for gentle repulsion
    let mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Generate floating glyphs
    const count = Math.min(24, Math.max(12, Math.floor(width / 70)));
    const glyphs = Array.from({ length: count }, (_, i) => ({
      text: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.25 - Math.random() * 0.4,
      size: 14 + Math.random() * 16,
      opacity: 0.12 + Math.random() * 0.16,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.008,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check current theme
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const baseR = isLight ? 8 : 82;
      const baseG = isLight ? 121 : 201;
      const baseB = isLight ? 93 : 155;

      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];

        // Drift motion
        g.x += g.vx;
        g.y += g.vy;
        g.rotation += g.vRot;

        // Mouse repulsion
        if (mouse.active) {
          const dx = g.x - mouse.x;
          const dy = g.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            g.x += (dx / dist) * force * 1.8;
            g.y += (dy / dist) * force * 1.8;
          }
        }

        // Screen wraps
        if (g.y < -30) {
          g.y = height + 30;
          g.x = Math.random() * width;
        }
        if (g.x < -30) g.x = width + 30;
        if (g.x > width + 30) g.x = -30;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.font = `600 ${g.size}px "DM Sans", "Segoe UI", sans-serif`;
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${g.opacity})`;
        ctx.shadowColor = `rgba(${baseR}, ${baseG}, ${baseB}, ${g.opacity * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.fillText(g.text, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
