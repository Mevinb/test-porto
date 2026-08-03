import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Code, Sparkles, Layers, Wrench, Cpu, Shield, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CareerRoadmap } from './CareerRoadmap';

const skillCategories = [
  {
    title: 'AI & Image Generation',
    icon: Sparkles,
    color: 'bg-[#EC5B38]/10 border-[#EC5B38]/25 text-[#EC5B38]',
    skills: ['Stable Diffusion', 'ComfyUI Workflows', 'LoRA Training', 'Prompt Engineering'],
    desc: 'Fine-tuning, custom pipeline assemblies, and specialized generative imaging node creation.',
  },
  {
    title: 'Backend & Systems',
    icon: Code,
    color: 'bg-[#A8A492]/10 border-[#A8A492]/25 text-[#A8A492]',
    skills: ['FastAPI', 'Flask', 'Node.js', 'Express.js'],
    desc: 'High-throughput secure APIs, custom server orchestration, and persistent databases.',
  },
  {
    title: 'Languages & UI',
    icon: Layers,
    color: 'bg-[#EC5B38]/10 border-[#EC5B38]/25 text-[#EC5B38]',
    skills: ['React', 'Python', 'Java', 'Kotlin', 'C'],
    desc: 'Robust script creation, desktop software packaging, and responsive modern web builds.',
  },
  {
    title: 'DevOps & Tooling',
    icon: Wrench,
    color: 'bg-[#A8A492]/10 border-[#A8A492]/25 text-[#A8A492]',
    skills: ['Docker Containers', 'Git Versioning', 'PyInstaller Compilation'],
    desc: 'Automated CI/CD deployments, reproducible dev nodes, and standalone executable bundling.',
  },
];

// Helper component for mouse spotlight on cards
function BentoCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isLight = theme === 'light';
  const spotlightColor = isLight ? 'rgba(236, 91, 56, 0.12)' : 'rgba(236, 91, 56, 0.15)';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      className={`group relative overflow-hidden bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#EC5B38]/15 light:border-[#D9CEBB]/90 rounded-3xl p-6 transition-all duration-300 hover:bg-[#5E5252] light:hover:bg-white hover:border-[#EC5B38]/35 light:hover:border-[#C9BEAA] shadow-lg light:shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${className}`}
    >
      {/* Dynamic Border spotlight light */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section id="about" ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-left mb-10 sm:mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#EC5B38] light:text-[#EC5B38] mb-2 sm:mb-3"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#FCF2E5] light:text-[#524646] tracking-tight leading-tight"
          >
            Engineering visual intelligence and secure server execution.
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Bento Card 1: Bio Detail Spotlight (Spans 2 columns on medium+) */}
          <BentoCard className="md:col-span-2 flex flex-col justify-between min-h-[280px] p-5 sm:p-6" delay={0.1}>
            <div>
              <div className="flex items-center gap-2 text-[#EC5B38] light:text-[#EC5B38] mb-4 sm:mb-6">
                <Cpu size={18} className="sm:w-[20px] sm:h-[20px]" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Background</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-[#FCF2E5] light:text-[#524646] mb-3 sm:mb-4 leading-snug">
                Optimizing generative processes for production-grade software architectures.
              </h3>
              <p className="text-[#A8A492] light:text-[#8A7B7B] text-xs sm:text-base leading-relaxed mb-5 sm:mb-6">
                I am a software engineer focused on developing secure, high-performance backends and optimizing generative image systems. I bridge the gaps between stable model checkpoints, complex ComfyUI workflows, and programmatic execution.
              </p>
            </div>
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-[#EC5B38]/15 light:border-[#D9CEBB]">
              <div>
                <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#EC5B38] to-[#A8A492] light:from-[#EC5B38] light:to-[#F06745]">
                  10+
                </div>
                <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#A8A492] light:text-[#A8A492] uppercase font-medium tracking-wider mt-0.5 sm:mt-1">
                  Active Projects
                </div>
              </div>
              <div>
                <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#EC5B38] to-[#A8A492] light:from-[#EC5B38] light:to-[#F06745]">
                  20+
                </div>
                <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#A8A492] light:text-[#A8A492] uppercase font-medium tracking-wider mt-0.5 sm:mt-1">
                  Custom Workflows
                </div>
              </div>
              <div>
                <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#EC5B38] to-[#A8A492] light:from-[#EC5B38] light:to-[#F06745]">
                  SecOps
                </div>
                <div className="text-[9px] xs:text-[10px] sm:text-xs text-[#A8A492] light:text-[#A8A492] uppercase font-medium tracking-wider mt-0.5 sm:mt-1">
                  Secure Auditing
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Bento Card 2: Interactive Feature Spotlight (Spans 1 column) */}
          <BentoCard className="md:col-span-1 p-5 sm:p-6" delay={0.2}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#A8A492] light:text-[#524646] mb-4 sm:mb-6">
                  <Zap size={18} className="sm:w-[20px] sm:h-[20px] text-[#EC5B38] light:text-[#EC5B38]" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Focus</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#FCF2E5] light:text-[#524646] mb-2 sm:mb-3">
                  Reactorv3 Face Pipeline
                </h3>
                <p className="text-[#A8A492] light:text-[#8A7B7B] text-xs sm:text-sm leading-relaxed">
                  Developed high-resolution face restoration, running complex model weights, merging custom checkpoints, and preserving specific identities through specialized prompt matrices.
                </p>
              </div>
              <div className="mt-6 sm:mt-8 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#EC5B38] light:text-[#EC5B38] bg-[#EC5B38]/5 light:bg-[#EC5B38]/5 border border-[#EC5B38]/15 light:border-[#EC5B38]/20 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl">
                <span>Face Enhancement Focus</span>
                <span className="w-2 h-2 rounded-full bg-[#EC5B38] light:bg-[#EC5B38] animate-pulse" />
              </div>
            </div>
          </BentoCard>

          {/* Bento Skill Categories Map (Cards 3, 4, 5, 6) */}
          {skillCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <BentoCard key={category.title} className="p-5 sm:p-6" delay={0.2 + idx * 0.1}>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Category Title & Icon */}
                    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-2.5 rounded-xl border ${category.color} light:bg-[#EC5B38]/10 light:border-[#EC5B38]/25 light:text-[#EC5B38]`}>
                        <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#FCF2E5] light:text-[#524646] uppercase tracking-wider">
                        {category.title}
                      </h4>
                    </div>

                    <p className="text-[#A8A492] light:text-[#8A7B7B] text-xs leading-relaxed mb-4 sm:mb-6">
                      {category.desc}
                    </p>
                  </div>

                  {/* Skills tags list */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-auto">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#524646]/80 light:bg-[#F4E9D8] border border-[#EC5B38]/15 light:border-[#D9CEBB] text-[#A8A492] light:text-[#524646] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </div>

        {/* Career & Innovation Roadmap Timeline */}
        <CareerRoadmap />

        {/* Anchor point for Skills navigation item */}
        <div id="skills" className="w-full h-px mt-12 sm:mt-16" />
      </div>
    </section>
  );
}
