import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function FluidBackground() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half of the width/height (250px) to center it on the mouse
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };

    // Position it at center initially
    mouseX.set(window.innerWidth / 2 - 250);
    mouseY.set(window.innerHeight / 2 - 250);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-950 via-slate-950 to-black">
      {/* Interactive Mouse-Tracking Glow Light */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/10 blur-[100px] mix-blend-screen will-change-transform"
        style={{
          left: springX,
          top: springY,
        }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-sky-500/8 blur-[80px] mix-blend-screen will-change-transform"
        style={{
          left: springX,
          top: springY,
        }}
      />

      {/* Grid Pattern Overlay — slightly stronger */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.07)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />

      {/* Ambient static blur nodes */}
      <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] rounded-full bg-indigo-900/20 blur-[130px]" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] rounded-full bg-fuchsia-950/20 blur-[130px]" />
      <div className="absolute top-[40%] right-[-5%] w-[30%] h-[30%] rounded-full bg-violet-900/10 blur-[100px]" />
      
      {/* Subtle organic noise to prevent banding */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOTAiIG51bU9jdGF2ZXM9IjMiIHN0aWNoVGlsZXM9InN0aWNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPjwvc3ZnPg==')] pointer-events-none" />
    </div>
  );
}
