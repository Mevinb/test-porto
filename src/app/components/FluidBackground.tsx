import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export function FluidBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 22, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 22, mass: 0.5 });

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

  // Interactive Particle Constellation Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isLight = theme === 'light';
    const particleCount = Math.min(Math.floor((width * height) / 14000), 80);
    const particles: Particle[] = [];
    const colors = isLight
      ? ['#0284c7', '#0891b2', 'rgba(2, 132, 199, 0.8)', 'rgba(14, 165, 233, 0.75)']
      : ['#b6d9e0', '#dbe2dc', 'rgba(182, 217, 224, 0.85)', 'rgba(219, 226, 220, 0.8)'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mousePos = { x: -1000, y: -1000 };
    const trackMouse = (e: MouseEvent) => {
      mousePos = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', trackMouse);

    const lineRgb = isLight ? '2, 132, 199' : '182, 217, 224';

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = isLight ? '#0284c7' : '#b6d9e0';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 150) * (isLight ? 0.22 : 0.28);
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse proximity connection glow
        const mdx = p1.x - mousePos.x;
        const mdy = p1.y - mousePos.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 220) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          const mAlpha = (1 - mdist / 220) * (isLight ? 0.35 : 0.45);
          ctx.strokeStyle = `rgba(${lineRgb}, ${mAlpha})`;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', trackMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06090e] light:bg-[#f4f8fa] transition-colors duration-500">
      {/* 1. Luminous Ambient Light Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,rgba(182,217,224,0.25)_0%,rgba(182,217,224,0.08)_45%,transparent_70%)] light:bg-[radial-gradient(circle,rgba(2,132,199,0.12)_0%,rgba(56,189,248,0.04)_45%,transparent_70%)] blur-[90px] animate-pulse [animation-duration:8s]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(219,226,220,0.22)_0%,rgba(182,217,224,0.06)_45%,transparent_70%)] light:bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,transparent_70%)] blur-[110px] animate-pulse [animation-duration:10s]" />
      <div className="absolute top-[25%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(182,217,224,0.18)_0%,transparent_60%)] light:bg-[radial-gradient(circle,rgba(2,132,199,0.08)_0%,transparent_60%)] blur-[80px]" />
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(219,226,220,0.18)_0%,transparent_60%)] light:bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_60%)] blur-[80px]" />

      {/* 2. Interactive Cursor-Tracking Luminous Spotlight */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(182,217,224,0.32)_0%,rgba(219,226,220,0.12)_40%,transparent_70%)] light:bg-[radial-gradient(circle,rgba(2,132,199,0.15)_0%,rgba(56,189,248,0.06)_40%,transparent_70%)] blur-[85px] will-change-transform mix-blend-screen light:mix-blend-multiply"
        style={{
          left: springX,
          top: springY,
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(182,217,224,0.22)_0%,transparent_65%)] light:bg-[radial-gradient(circle,rgba(2,132,199,0.1)_0%,transparent_65%)] blur-[50px] will-change-transform"
        style={{
          left: springX,
          top: springY,
        }}
      />

      {/* 3. Dynamic Interactive Canvas Constellation Web */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-90" />

      {/* 4. Cybernetic Precision Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(182,217,224,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(182,217,224,0.11)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgba(2,132,199,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,132,199,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_at_center,black_80%,transparent_100%)]" />

      {/* 5. Animated Laser Scanbeam */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b6d9e0]/60 light:via-[#0284c7]/50 to-transparent shadow-[0_0_18px_#b6d9e0] light:shadow-[0_0_18px_#0284c7] animate-[scanbeam_10s_linear_infinite]" />

      {/* 6. Futuristic Telemetry Watermarks & HUD Corner Reticles */}
      <div className="absolute top-6 left-8 hidden md:flex items-center gap-3 text-[11px] font-mono text-[#b6d9e0]/45 light:text-[#0284c7]/60 select-none tracking-widest uppercase font-semibold">
        <span className="w-2 h-2 rounded-full bg-[#b6d9e0] light:bg-[#0284c7] animate-ping" />
        <span>SYS.ONLINE // 0x7F2B</span>
      </div>
      <div className="absolute top-6 right-8 text-[11px] font-mono text-[#b6d9e0]/45 light:text-[#0284c7]/60 select-none tracking-widest uppercase font-semibold hidden md:block">
        QUANTUM_NODE: ACTIVE [v3-alpha]
      </div>
      <div className="absolute bottom-6 left-8 text-[11px] font-mono text-[#b6d9e0]/45 light:text-[#0284c7]/60 select-none tracking-widest uppercase font-semibold hidden md:block">
        LATENCY: 1.2ms // SECURE
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />
      <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />
      <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />
      <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />

      {/* Keyframe animation for laser scanbeam */}
      <style>{`
        @keyframes scanbeam {
          0% { top: -5%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
