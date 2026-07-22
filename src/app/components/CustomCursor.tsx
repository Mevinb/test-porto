import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clickParticles, setClickParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for trailing outer ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.2 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide cursor on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]')
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY };
      setClickParticles((prev) => [...prev.slice(-4), newParticle]);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Precision Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#b6d9e0] shadow-[0_0_10px_#b6d9e0]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicked ? 1.8 : isHovered ? 0 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />

      {/* Trailing Reticle Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#b6d9e0]/40 backdrop-blur-[1px] flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 48 : isClicked ? 24 : 32,
          height: isHovered ? 48 : isClicked ? 24 : 32,
          borderColor: isHovered ? 'rgba(182, 217, 224, 0.9)' : 'rgba(219, 226, 220, 0.35)',
          backgroundColor: isHovered ? 'rgba(182, 217, 224, 0.08)' : 'rgba(182, 217, 224, 0.02)',
          boxShadow: isHovered
            ? '0 0 20px rgba(182, 217, 224, 0.3), inset 0 0 10px rgba(182, 217, 224, 0.15)'
            : '0 0 10px rgba(182, 217, 224, 0.1)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.2 }}
      >
        {/* Futuristic reticle corner crosshairs on hover */}
        {isHovered && (
          <>
            <span className="absolute -top-1 w-2 h-[1px] bg-[#b6d9e0]" />
            <span className="absolute -bottom-1 w-2 h-[1px] bg-[#b6d9e0]" />
            <span className="absolute -left-1 h-2 w-[1px] bg-[#b6d9e0]" />
            <span className="absolute -right-1 h-2 w-[1px] bg-[#b6d9e0]" />
          </>
        )}
      </motion.div>

      {/* Click Shockwave Particles */}
      {clickParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed top-0 left-0 rounded-full border border-[#b6d9e0]"
          style={{
            left: particle.x,
            top: particle.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 60, height: 60, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
