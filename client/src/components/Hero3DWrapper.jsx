import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero3DWrapper({ children, className = "" }) {
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.8]);
  const heroRotateX = useTransform(scrollY, [0, 800], [0, 25]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <section className={`relative isolate ${className}`} style={{ perspective: "1500px" }}>
      <motion.div
        style={{
          scale: heroScale,
          rotateX: heroRotateX,
          opacity: heroOpacity,
          y: heroY,
          transformStyle: "preserve-3d",
        }}
        className="origin-top"
      >
        {children}
      </motion.div>
    </section>
  );
}
