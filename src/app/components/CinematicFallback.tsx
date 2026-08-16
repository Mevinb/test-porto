import { motion } from 'motion/react';

export function CinematicFallback() {
  return (
    <div className="cinematic-fallback" aria-hidden="true">
      <motion.div
        animate={{ rotateX: [62, 67, 62], rotateZ: [42, 47, 42] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="cinematic-fallback-core"
      >
        <span />
        <span />
        <span />
      </motion.div>
      <div className="cinematic-fallback-grid" />
      <div className="cinematic-fallback-glow" />
    </div>
  );
}
