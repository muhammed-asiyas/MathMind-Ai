import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";

function ScrollEffects() {
  const location = useLocation();
  const previousLocation = useRef({ pathname: location.pathname, hash: location.hash });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const previous = previousLocation.current;
    if (previous.pathname === location.pathname && previous.hash === location.hash) return;
    previousLocation.current = { pathname: location.pathname, hash: location.hash };

    const frameId = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
          target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
          return;
        }
      }

      if (previous.pathname === location.pathname) return;
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.hash, location.pathname]);

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  );
}

export default ScrollEffects;
