import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Mail, Sparkles, Shield, Cpu, Play } from 'lucide-react';

const PROFILE_LINKS = {
  github: 'https://github.com/Mevinb',
  email: 'mailto:mevinbenty507@gmail.com',
};

const TERMINAL_LINES = [
  { text: 'pip install stable-diffusion-diffusers comfyui-api', type: 'command' },
  { text: 'Collecting stable-diffusion-diffusers...', type: 'output' },
  { text: '  Downloading model weights [100% |██████████| 4.12 GB]', type: 'output' },
  { text: 'python run_restoration_pipeline.py --checkpoint v3-alpha', type: 'command' },
  { text: '[INFO] Initializing Reactorv3 facial restoration...', type: 'output' },
  { text: '[INFO] Mapping identity latents & scale matching...', type: 'output' },
  { text: '[SAMPLER] Steps: 20/20 [====================] 100% (0.8s)', type: 'output' },
  { text: '[SUCCESS] Target enhanced successfully (1240x1240px)', type: 'success' },
  { text: '[OUTPUT] Saved artifact to outputs/reactor_face_v3.png', type: 'success' },
];

export function Hero() {
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineCharIdx, setCurrentLineCharIdx] = useState(0);
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'success'>('idle');

  // Terminal Typing Simulation Effect
  useEffect(() => {
    if (terminalIndex >= TERMINAL_LINES.length) {
      // Loop back after 4 seconds
      const timeout = setTimeout(() => {
        setTerminalIndex(0);
        setDisplayedLines([]);
        setTerminalText('');
        setCurrentLineCharIdx(0);
        setPipelineState('idle');
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const currentLine = TERMINAL_LINES[terminalIndex];

    if (currentLine.type === 'command') {
      setPipelineState('running');
      if (currentLineCharIdx < currentLine.text.length) {
        const charTimeout = setTimeout(() => {
          setTerminalText((prev) => prev + currentLine.text[currentLineCharIdx]);
          setCurrentLineCharIdx((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(charTimeout);
      } else {
        // Command finished typing. Push to list and move to next
        const pushTimeout = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, `> ${currentLine.text}`]);
          setTerminalText('');
          setCurrentLineCharIdx(0);
          setTerminalIndex((prev) => prev + 1);
        }, 400);
        return () => clearTimeout(pushTimeout);
      }
    } else {
      // Output lines appear instantly or short delay
      const outputTimeout = setTimeout(() => {
        let prefix = '';
        if (currentLine.type === 'success') prefix = '✔ ';
        setDisplayedLines((prev) => [...prev, prefix + currentLine.text]);
        
        if (currentLine.text.includes('[SUCCESS]')) {
          setPipelineState('success');
        }
        
        setTerminalIndex((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(outputTimeout);
    }
  }, [terminalIndex, currentLineCharIdx]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-6 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Headline and Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles size={14} className="animate-pulse" />
            AI Workflow Engineer & DevSecOps
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Building{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-500 font-black">
              Next-Gen AI
            </span>
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 font-black">
              Pipelines
            </span>{' '}
            and Secure Systems.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-8"
          >
            I specialize in optimizing generative imaging workflows, developing robust facial restoration pipelines (Reactorv3), and creating secure backend architectures with automated systems.
          </motion.p>

          {/* Focus Tags / Micro-features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 shadow-md"
            >
              <Cpu size={14} className="text-indigo-400" />
              <span>Stable Diffusion</span>
            </motion.div>
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 shadow-md"
            >
              <Sparkles size={14} className="text-purple-400" />
              <span>ComfyUI Custom Workflows</span>
            </motion.div>
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 shadow-md"
            >
              <Shield size={14} className="text-pink-400" />
              <span>PowerShell & Python Security</span>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <motion.a
              href={PROFILE_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Github size={18} />
              <span>Explore Repositories</span>
            </motion.a>

            <motion.a
              href={PROFILE_LINKS.email}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 rounded-xl text-slate-200 hover:text-white font-semibold transition-all cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={18} />
              <span>Get In Touch</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Right Column: Terminal and Fluid Graphics Mockup */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          
          {/* Glow orb behind terminal */}
          <div className="absolute -z-10 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-[70px]" />

          {/* Main Container glassmorphism block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full aspect-[4/3] sm:aspect-[1.4] bg-slate-950/80 backdrop-blur-xl border border-indigo-500/20 rounded-2xl shadow-2xl shadow-indigo-950/50 overflow-hidden flex flex-col ring-1 ring-indigo-500/10"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/70 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-slate-400 text-[10px] font-mono select-none">
                mevin@reactor-vm:~
              </div>
              <div className="w-4 h-4" /> {/* Spacer */}
            </div>

            {/* Terminal Screen area */}
            <div className="flex-1 p-4 font-mono text-[11px] sm:text-xs text-slate-300 space-y-1.5 overflow-y-auto select-none scrollbar-none bg-slate-950/40">
              {displayedLines.map((line, idx) => {
                let colorClass = 'text-slate-300';
                if (line.startsWith('>')) colorClass = 'text-indigo-300 font-semibold';
                else if (line.startsWith('✔')) colorClass = 'text-emerald-400 font-medium';
                else if (line.includes('[SUCCESS]')) colorClass = 'text-emerald-400 font-bold';
                else if (line.includes('Downloading')) colorClass = 'text-amber-300';
                else if (line.includes('[INFO]')) colorClass = 'text-blue-400';
                else if (line.includes('[SAMPLER]')) colorClass = 'text-purple-300';
                else if (line.includes('[OUTPUT]')) colorClass = 'text-cyan-300';
                
                return (
                  <div key={idx} className={`${colorClass} leading-relaxed`}>
                    {line}
                  </div>
                );
              })}
              
              {/* Active command line typing */}
              {terminalIndex < TERMINAL_LINES.length && TERMINAL_LINES[terminalIndex].type === 'command' && (
                <div className="text-indigo-300 font-semibold flex items-center">
                  <span>&gt; {terminalText}</span>
                  <span className="w-1.5 h-3.5 bg-indigo-400 ml-0.5 animate-pulse rounded-sm" />
                </div>
              )}
            </div>

            {/* Generative Visualizer Panel (triggered when successful) */}
            <AnimatePresence>
              {pipelineState === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 border-t border-slate-800"
                >
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.3)] mb-4"
                  >
                    {/* Generative Fluid CSS animation to mimic image creation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 animate-spin [animation-duration:15s]" />
                    <div className="absolute inset-[3px] rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-fuchsia-500/30 blur-md animate-pulse" />
                      <Sparkles size={24} className="text-indigo-400 animate-bounce" />
                    </div>
                  </motion.div>
                  <div className="text-xs text-slate-200 font-medium tracking-wide">
                    Generation Render Complete
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    v3-alpha-diffusion.ckpt • Steps: 20 • CFG: 7.5
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pipeline progress bar indicator */}
            <div className="h-1.5 bg-slate-900/80">
              {pipelineState === 'running' && (
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                />
              )}
              {pipelineState === 'success' && (
                <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
