import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Code, Sparkles, Layers, Wrench, Cpu, Shield, Zap } from 'lucide-react';

const skillCategories = [
  {
    title: 'AI & Image Generation',
    icon: Sparkles,
    color: 'from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-400',
    skills: ['Stable Diffusion', 'ComfyUI Workflows', 'LoRA Training', 'Prompt Engineering'],
    desc: 'Fine-tuning, custom pipeline assemblies, and specialized generative imaging node creation.',
  },
  {
    title: 'Backend & Systems',
    icon: Code,
    color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400',
    skills: ['FastAPI', 'Flask', 'Node.js', 'Express.js'],
    desc: 'High-throughput secure APIs, custom server orchestration, and persistent databases.',
  },
  {
    title: 'Languages & UI',
    icon: Layers,
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
    skills: ['React', 'Python', 'Java', 'Kotlin', 'C'],
    desc: 'Robust script creation, desktop software packaging, and responsive modern web builds.',
  },
  {
    title: 'DevOps & Tooling',
    icon: Wrench,
    color: 'from-purple-500/20 to-rose-500/20 border-purple-500/30 text-purple-400',
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
      className={`group relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 transition-colors duration-300 hover:bg-slate-900/60 hover:border-slate-700/50 ${className}`}
    >
      {/* Dynamic Border spotlight light */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
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
    <section id="about" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-left mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Engineering visual intelligence and secure server execution.
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Bio Detail Spotlight (Spans 2 columns on medium+) */}
          <BentoCard className="md:col-span-2 flex flex-col justify-between min-h-[300px]" delay={0.1}>
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-6">
                <Cpu size={20} />
                <span className="text-sm font-semibold tracking-wider uppercase">Background</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-snug">
                Optimizing generative processes for production-grade software architectures.
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                I am a software engineer focused on developing secure, high-performance backends and optimizing generative image systems. I bridge the gaps between stable model checkpoints, complex ComfyUI workflows, and programmatic execution.
              </p>
            </div>
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  10+
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium tracking-wider mt-1">
                  Active Projects
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  20+
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium tracking-wider mt-1">
                  Custom Workflows
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                  SecOps
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium tracking-wider mt-1">
                  Secure Auditing
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Bento Card 2: Interactive Feature Spotlight (Spans 1 column) */}
          <BentoCard className="md:col-span-1" delay={0.2}>
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 mb-6">
                  <Zap size={20} />
                  <span className="text-sm font-semibold tracking-wider uppercase">Focus</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Reactorv3 Face Pipeline
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Developed high-resolution face restoration, running complex model weights, merging custom checkpoints, and preserving specific identities through specialized prompt matrices.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 px-4 py-3 rounded-2xl">
                <span>Face Enhancement Focus</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
            </div>
          </BentoCard>

          {/* Bento Skill Categories Map (Cards 3, 4, 5, 6) */}
          {skillCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <BentoCard key={category.title} delay={0.2 + idx * 0.1}>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Category Title & Icon */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${category.color.split(' ')[2]}`}>
                        <Icon size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {category.title}
                      </h4>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                      {category.desc}
                    </p>
                  </div>

                  {/* Skills tags list */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] sm:text-xs px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 font-medium"
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

        {/* Anchor point for Skills navigation item */}
        <div id="skills" className="w-full h-px mt-16" />
      </div>
    </section>
  );
}
