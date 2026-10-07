import { motion } from "framer-motion";

export default function Hero3DWrapper({ children, className = "" }) {
  return (
    <section className={`relative isolate ${className}`} style={{ perspective: "1500px" }}>
      <motion.div
        initial={{ opacity: 0, y: 12, rotateX: -2 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="origin-top"
      >
        {children}
      </motion.div>
    </section>
  );
}
