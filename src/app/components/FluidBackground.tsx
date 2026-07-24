import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { FluidCustomizer, FluidCustomizerOptions } from './FluidCustomizer';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const DEFAULT_OPTIONS: FluidCustomizerOptions = {
  themePreset: 'quantum',
  particleDensity: 'medium',
  speedMultiplier: 1,
  showConstellations: true,
};

export function FluidBackground() {
  const { theme } = useTheme();
  const [customOptions, setCustomOptions] = useState<FluidCustomizerOptions>(DEFAULT_OPTIONS);

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

  // Dynamic colors for particle canvas
  const getPresetColors = (preset: FluidCustomizerOptions['themePreset'], isLight: boolean) => {
    switch (preset) {
      case 'emerald':
        return isLight
          ? ['#059669', '#10b981', 'rgba(5, 150, 105, 0.8)', 'rgba(52, 211, 153, 0.75)']
          : ['#10b981', '#34d399', 'rgba(16, 185, 129, 0.85)', 'rgba(52, 211, 153, 0.8)'];
      case 'cyberpunk':
        return isLight
          ? ['#e11d48', '#9333ea', 'rgba(225, 29, 72, 0.8)', 'rgba(147, 51, 234, 0.75)']
          : ['#f43f5e', '#a855f7', 'rgba(244, 63, 94, 0.85)', 'rgba(168, 85, 247, 0.8)'];
      case 'solar':
        return isLight
          ? ['#d97706', '#ea580c', 'rgba(217, 119, 6, 0.8)', 'rgba(234, 88, 12, 0.75)']
          : ['#f59e0b', '#fb923c', 'rgba(245, 158, 11, 0.85)', 'rgba(251, 146, 60, 0.8)'];
      case 'monochrome':
        return isLight
          ? ['#475569', '#64748b', 'rgba(71, 85, 105, 0.8)', 'rgba(100, 116, 139, 0.75)']
          : ['#94a3b8', '#cbd5e1', 'rgba(148, 163, 184, 0.85)', 'rgba(203, 213, 225, 0.8)'];
      case 'quantum':
      default:
        return isLight
          ? ['#0284c7', '#0891b2', 'rgba(2, 132, 199, 0.8)', 'rgba(14, 165, 233, 0.75)']
          : ['#b6d9e0', '#dbe2dc', 'rgba(182, 217, 224, 0.85)', 'rgba(219, 226, 220, 0.8)'];
    }
  };

  const getLineRgb = (preset: FluidCustomizerOptions['themePreset'], isLight: boolean) => {
    switch (preset) {
      case 'emerald':
        return isLight ? '5, 150, 105' : '16, 185, 129';
      case 'cyberpunk':
        return isLight ? '225, 29, 72' : '244, 63, 94';
      case 'solar':
        return isLight ? '217, 119, 6' : '245, 158, 11';
      case 'monochrome':
        return isLight ? '71, 85, 105' : '148, 163, 184';
      case 'quantum':
      default:
        return isLight ? '2, 132, 199' : '182, 217, 224';
    }
  };

  // Dynamic Orbs & Spotlight Gradients
  const getOrbGradientStyles = (preset: FluidCustomizerOptions['themePreset'], isLight: boolean) => {
    switch (preset) {
      case 'emerald':
        return {
          orb1: isLight
            ? 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, transparent 70%)',
          orb2: isLight
            ? 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 70%)',
          spotlight: isLight
            ? 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.32) 0%, transparent 70%)',
        };
      case 'cyberpunk':
        return {
          orb1: isLight
            ? 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(244,63,94,0.28) 0%, transparent 70%)',
          orb2: isLight
            ? 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)',
          spotlight: isLight
            ? 'radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(244,63,94,0.32) 0%, transparent 70%)',
        };
      case 'solar':
        return {
          orb1: isLight
            ? 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.28) 0%, transparent 70%)',
          orb2: isLight
            ? 'radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251,146,60,0.22) 0%, transparent 70%)',
          spotlight: isLight
            ? 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.32) 0%, transparent 70%)',
        };
      case 'monochrome':
        return {
          orb1: isLight
            ? 'radial-gradient(circle, rgba(148,163,184,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(148,163,184,0.28) 0%, transparent 70%)',
          orb2: isLight
            ? 'radial-gradient(circle, rgba(203,213,225,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(203,213,225,0.22) 0%, transparent 70%)',
          spotlight: isLight
            ? 'radial-gradient(circle, rgba(148,163,184,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(148,163,184,0.32) 0%, transparent 70%)',
        };
      case 'quantum':
      default:
        return {
          orb1: isLight
            ? 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(182,217,224,0.28) 0%, transparent 70%)',
          orb2: isLight
            ? 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(219,226,220,0.22) 0%, transparent 70%)',
          spotlight: isLight
            ? 'radial-gradient(circle, rgba(2,132,199,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(182,217,224,0.32) 0%, transparent 70%)',
        };
    }
  };

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

    // Density calculation based on customOptions
    let densityBase = 14000;
    if (customOptions.particleDensity === 'low') densityBase = 22000;
    if (customOptions.particleDensity === 'high') densityBase = 8000;

    const particleCount = Math.min(Math.floor((width * height) / densityBase), 120);
    const particles: Particle[] = [];
    const colors = getPresetColors(customOptions.themePreset, isLight);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5 * customOptions.speedMultiplier,
        vy: (Math.random() - 0.5) * 0.5 * customOptions.speedMultiplier,
        size: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mousePos = { x: -1000, y: -1000 };
    const trackMouse = (e: MouseEvent) => {
      mousePos = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', trackMouse);

    const lineRgb = getLineRgb(customOptions.themePreset, isLight);

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
        ctx.shadowColor = colors[0];
        ctx.fill();
        ctx.shadowBlur = 0;

        if (customOptions.showConstellations) {
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
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', trackMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, customOptions]);

  const isLight = theme === 'light';
  const orbStyles = getOrbGradientStyles(customOptions.themePreset, isLight);

  return (
    <>
      {/* ── Background Canvas Layer (z-0, pointer-events-none) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06090e] light:bg-[#f4f8fa] transition-colors duration-500">
        {/* 1. Luminous Ambient Light Orbs */}
        <div
          className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] rounded-full blur-[90px] animate-pulse [animation-duration:8s] transition-all duration-700"
          style={{ background: orbStyles.orb1 }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[110px] animate-pulse [animation-duration:10s] transition-all duration-700"
          style={{ background: orbStyles.orb2 }}
        />

        {/* 2. Interactive Cursor-Tracking Luminous Spotlight */}
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-[85px] will-change-transform mix-blend-screen light:mix-blend-multiply transition-all duration-500"
          style={{
            left: springX,
            top: springY,
            background: orbStyles.spotlight,
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
        <div className="absolute bottom-6 right-8 text-[11px] font-mono text-[#b6d9e0]/45 light:text-[#0284c7]/60 select-none tracking-widest uppercase font-semibold hidden md:block">
          PRESET: {customOptions.themePreset.toUpperCase()} // SPEED: {customOptions.speedMultiplier}X
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />
        <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />
        <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />
        <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-[#b6d9e0]/35 light:border-[#0284c7]/35 select-none hidden md:block" />

        <style>{`
          @keyframes scanbeam {
            0% { top: -5%; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { top: 105%; opacity: 0; }
          }
        `}</style>
      </div>

      {/* ── Shader Control Panel Layer (z-50, pointer-events-auto) ── */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <FluidCustomizer
          options={customOptions}
          onChange={(opts) => setCustomOptions(opts)}
          onReset={() => setCustomOptions(DEFAULT_OPTIONS)}
        />
      </div>
    </>
  );
}
