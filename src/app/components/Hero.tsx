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
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Headline and Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#b6d9e0]/10 border border-[#b6d9e0]/30 text-[#b6d9e0] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 shadow-[0_0_15px_rgba(182,217,224,0.15)]"
          >
            <Sparkles size={13} className="animate-pulse text-[#b6d9e0] shrink-0" />
            <span>AI Workflow Engineer & DevSecOps</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#eef4f6] tracking-tight leading-[1.15] mb-5 sm:mb-6"
          >
            Building{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b6d9e0] via-[#dbe2dc] to-[#ffffff] font-black">
              Next-Gen AI
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#dbe2dc] to-[#b6d9e0] font-black">
              Pipelines
            </span>{' '}
            and Secure Systems.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#8ea4b0] text-sm sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-6 sm:mb-8"
          >
            I specialize in optimizing generative imaging workflows, developing robust facial restoration pipelines (Reactorv3), and creating secure backend architectures with automated systems.
          </motion.p>

          {/* Focus Tags / Micro-features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10"
          >
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1218] border border-[#b6d9e0]/20 text-[11px] sm:text-xs text-[#dbe2dc] shadow-md"
            >
              <Cpu size={13} className="text-[#b6d9e0] shrink-0" />
              <span>Stable Diffusion</span>
            </motion.div>
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1218] border border-[#b6d9e0]/20 text-[11px] sm:text-xs text-[#dbe2dc] shadow-md"
            >
              <Sparkles size={13} className="text-[#dbe2dc] shrink-0" />
              <span>ComfyUI Custom Workflows</span>
            </motion.div>
            <motion.div 
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1218] border border-[#b6d9e0]/20 text-[11px] sm:text-xs text-[#dbe2dc] shadow-md"
            >
              <Shield size={13} className="text-[#b6d9e0] shrink-0" />
              <span>PowerShell & Python Security</span>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <motion.a
              href={PROFILE_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#b6d9e0] hover:bg-[#cce5eb] text-[#080c10] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_25px_rgba(182,217,224,0.3)] transition-all overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Github size={17} />
              <span>Explore Repositories</span>
            </motion.a>

            <motion.a
              href={PROFILE_LINKS.email}
              className="flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#0d1218]/90 hover:bg-[#141c24] backdrop-blur-sm border border-[#b6d9e0]/20 hover:border-[#b6d9e0]/40 rounded-xl text-[#eef4f6] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={17} />
              <span>Get In Touch</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Right Column: Terminal and Fluid Graphics Mockup */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          
          {/* Glow orb behind terminal */}
          <div className="absolute -z-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-radial from-[#b6d9e0]/15 via-[#dbe2dc]/8 to-transparent blur-[70px]" />

          {/* Main Container glassmorphism block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full h-72 xs:h-80 sm:h-auto sm:aspect-[1.4] bg-[#0d1218]/90 backdrop-blur-xl border border-[#b6d9e0]/25 rounded-2xl shadow-2xl shadow-[#080c10]/80 overflow-hidden flex flex-col ring-1 ring-[#b6d9e0]/15"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#080c10]/80 border-b border-[#b6d9e0]/15">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#b6d9e0]/40" />
                <div className="w-3 h-3 rounded-full bg-[#dbe2dc]/40" />
                <div className="w-3 h-3 rounded-full bg-[#b6d9e0]/20" />
              </div>
              <div className="text-[#8ea4b0] text-[10px] font-mono select-none">
                mevin@reactor-vm:~
              </div>
              <div className="w-4 h-4" />
            </div>

            {/* Terminal Screen area */}
            <div className="flex-1 p-4 font-mono text-[11px] sm:text-xs text-[#dbe2dc] space-y-1.5 overflow-y-auto select-none scrollbar-none bg-[#080c10]/60">
              {displayedLines.map((line, idx) => {
                let colorClass = 'text-[#8ea4b0]';
                if (line.startsWith('>')) colorClass = 'text-[#b6d9e0] font-semibold';
                else if (line.startsWith('✔')) colorClass = 'text-[#b6d9e0] font-medium';
                else if (line.includes('[SUCCESS]')) colorClass = 'text-[#b6d9e0] font-bold';
                else if (line.includes('Downloading')) colorClass = 'text-[#dbe2dc]';
                else if (line.includes('[INFO]')) colorClass = 'text-[#b6d9e0]/80';
                else if (line.includes('[SAMPLER]')) colorClass = 'text-[#dbe2dc]';
                else if (line.includes('[OUTPUT]')) colorClass = 'text-[#b6d9e0]';
                
                return (
                  <div key={idx} className={`${colorClass} leading-relaxed`}>
                    {line}
                  </div>
                );
              })}
              
              {/* Active command line typing */}
              {terminalIndex < TERMINAL_LINES.length && TERMINAL_LINES[terminalIndex].type === 'command' && (
                <div className="text-[#b6d9e0] font-semibold flex items-center">
                  <span>&gt; {terminalText}</span>
                  <span className="w-1.5 h-3.5 bg-[#b6d9e0] ml-0.5 animate-pulse rounded-sm" />
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
                  className="absolute inset-0 bg-[#080c10]/95 flex flex-col items-center justify-center p-6 border-t border-[#b6d9e0]/20"
                >
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-[#b6d9e0]/40 shadow-[0_0_50px_rgba(182,217,224,0.3)] mb-4"
                  >
                    {/* Generative Cyber animation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b6d9e0] via-[#dbe2dc] to-[#080c10] animate-spin [animation-duration:15s]" />
                    <div className="absolute inset-[3px] rounded-lg bg-[#080c10] overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-radial from-[#b6d9e0]/30 to-transparent blur-md animate-pulse" />
                      <Sparkles size={24} className="text-[#b6d9e0] animate-bounce" />
                    </div>
                  </motion.div>
                  <div className="text-xs text-[#eef4f6] font-medium tracking-wide">
                    Generation Render Complete
                  </div>
                  <div className="text-[10px] text-[#8ea4b0] font-mono mt-1">
                    v3-alpha-diffusion.ckpt • Steps: 20 • CFG: 7.5
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pipeline progress bar indicator */}
            <div className="h-1.5 bg-[#080c10]">
              {pipelineState === 'running' && (
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#b6d9e0] to-[#dbe2dc]"
                  initial={{ width: '0%' }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                />
              )}
              {pipelineState === 'success' && (
                <div className="h-full w-full bg-[#b6d9e0]" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
