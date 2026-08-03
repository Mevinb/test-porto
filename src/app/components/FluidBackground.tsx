import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function FluidBackground() {
  const { theme } = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20, mass: 0.6 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 350);
      mouseY.set(e.clientY - 350);
    };
    mouseX.set(window.innerWidth / 2 - 350);
    mouseY.set(window.innerHeight / 2 - 350);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const isLight = theme === 'light';

  const orbStyles = isLight
    ? {
        orb1: 'radial-gradient(circle, rgba(236, 91, 56, 0.10) 0%, transparent 70%)',
        orb2: 'radial-gradient(circle, rgba(168, 164, 146, 0.22) 0%, transparent 70%)',
        spotlight: 'radial-gradient(circle, rgba(236, 91, 56, 0.10) 0%, transparent 70%)',
      }
    : {
        orb1: 'radial-gradient(circle, rgba(236, 91, 56, 0.16) 0%, transparent 70%)',
        orb2: 'radial-gradient(circle, rgba(168, 164, 146, 0.14) 0%, transparent 70%)',
        spotlight: 'radial-gradient(circle, rgba(236, 91, 56, 0.13) 0%, transparent 70%)',
      };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isLightMode = theme === 'light';
    const particleRgb = isLightMode ? '82, 70, 70' : '236, 91, 56';

    const particleCount = Math.min(Math.floor((width * height) / 16000), 70);
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.35 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleRgb}, ${p.alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#524646] light:bg-[#FCF2E5] transition-colors duration-500">
      {/* Ambient warm light orbs */}
      <div
        className="absolute top-[-15%] left-[-12%] w-[60vw] h-[60vw] rounded-full blur-[100px] animate-pulse [animation-duration:9s] transition-all duration-700"
        style={{ background: orbStyles.orb1 }}
      />
      <div
        className="absolute bottom-[-18%] right-[-12%] w-[65vw] h-[65vw] rounded-full blur-[120px] animate-pulse [animation-duration:12s] transition-all duration-700"
        style={{ background: orbStyles.orb2 }}
      />

      {/* Gentle cursor-tracking glow */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-[90px] will-change-transform mix-blend-screen light:mix-blend-multiply transition-all duration-500"
        style={{
          left: springX,
          top: springY,
          background: orbStyles.spotlight,
        }}
      />

      {/* Subtle drifting particles */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-80" />
    </div>
  );
}
