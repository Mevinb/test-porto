import { motion } from 'motion/react';
import { Github, Mail, Sparkles, Shield, Cpu, MapPin, ArrowUpRight, BadgeCheck, Code2 } from 'lucide-react';
import { Rockets } from './Rockets';
import { Planet } from './Planet';

const PROFILE_LINKS = {
  github: 'https://github.com/Mevinb',
  email: 'mailto:mevinbenty507@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mevin-benty-17305a322',
};

const FOCUS_AREAS = [
  { icon: Cpu, label: 'Stable Diffusion' },
  { icon: Sparkles, label: 'ComfyUI Workflows' },
  { icon: Shield, label: 'Python & PowerShell Security' },
];

const HIGHLIGHTS = [
  { value: '10+', label: 'Active Projects' },
  { value: '20+', label: 'Custom Workflows' },
  { value: '42', label: 'GitHub Stars' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-28 pb-12 px-4 sm:px-6 overflow-hidden">
      <Planet />
      <Rockets />
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headline and Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#90B800]/10 light:bg-[#90B800]/10 border border-[#90B800]/30 light:border-[#90B800]/30 text-[#90B800] text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(144, 184, 0,0.12)]"
          >
            <Sparkles size={13} className="animate-pulse shrink-0" />
            <span>AI Workflow Engineer & DevSecOps</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#FCF2E5] light:text-[#524646] tracking-tight leading-[1.15] mb-6"
          >
            <span className="block text-base sm:text-xl md:text-2xl text-[#A8A492] light:text-[#8A7B7B] mb-2">
              Mevin Benty - Developer &amp; Engineering Student
            </span>
            Building{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#90B800] via-[#A8D500] to-[#FCF2E5] light:from-[#90B800] light:via-[#789900] light:to-[#524646] font-black">
              Next-Gen AI
            </span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#A8A492] to-[#A8D500] light:from-[#90B800] light:to-[#8A7B7B] font-black">
              Pipelines
            </span>{' '}
            and Secure Systems.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.64, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#A8A492] light:text-[#8A7B7B] text-sm sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-8"
          >
            I am a software developer and engineering student specializing in generative imaging workflows,
            facial restoration pipelines, and secure backend architectures with automated systems.
          </motion.p>

          {/* Focus Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.78 }}
            className="flex flex-wrap gap-2 sm:gap-3 mb-10"
          >
            {FOCUS_AREAS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#5E5252]/80 light:bg-white border border-[#A8A492]/25 light:border-[#D9CEBB] text-[11px] sm:text-xs text-[#FCF2E5] light:text-[#524646] shadow-md"
                >
                  <Icon size={13} className="text-[#90B800] shrink-0" />
                  <span>{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <motion.a
              href={PROFILE_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#90B800] hover:bg-[#A8D500] text-[#FCF2E5] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_25px_rgba(144, 184, 0,0.25)] transition-all overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Github size={17} />
              <span>Explore Repositories</span>
            </motion.a>

            <motion.a
              href={PROFILE_LINKS.email}
              className="flex items-center justify-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#5E5252]/90 light:bg-white/90 hover:bg-[#6B5D5D] light:hover:bg-[#F4E9D8] backdrop-blur-sm border border-[#A8A492]/30 light:border-[#D9CEBB] rounded-xl text-[#FCF2E5] light:text-[#524646] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={17} />
              <span>Get In Touch</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Right Column: Professional Profile Card */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          {/* Soft glow behind card */}
          <div className="absolute -z-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-radial from-[#90B800]/15 light:from-[#90B800]/10 via-[#A8A492]/8 to-transparent blur-[70px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-[#5E5252]/85 light:bg-white/95 backdrop-blur-xl border border-[#A8A492]/25 light:border-[#D9CEBB] rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#90B800] via-[#A8D500] to-[#A8A492]" />

            <div className="p-6 sm:p-8">
              {/* Header: monogram + identity */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#90B800] text-[#FCF2E5] flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg shadow-[#90B800]/30">
                    MB
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#A8A492] border-2 border-[#5E5252] light:border-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#FCF2E5] light:text-[#524646] leading-tight">
                    Mevin Benty
                  </h2>
                  <p className="text-[11px] sm:text-xs font-medium text-[#A8A492] light:text-[#8A7B7B] mt-0.5">
                    Software Engineer · AI Pipeline Specialist
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-[#A8A492]/15 border border-[#A8A492]/30 text-[10px] font-semibold text-[#A8A492] light:text-[#8A7B7B]">
                    <BadgeCheck size={11} className="text-[#90B800]" />
                    Open to opportunities
                  </span>
                </div>
              </div>

              {/* Location line */}
              <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#A8A492] light:text-[#8A7B7B]">
                <MapPin size={12} className="text-[#90B800] shrink-0" />
                <span>Thrissur, Kerala · Remote-friendly</span>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
                {HIGHLIGHTS.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-[#4F4444] light:bg-[#F7EBDD] border border-[#A8A492]/20 light:border-[#EFE3D0] text-center"
                  >
                    <div className="text-base sm:text-lg font-extrabold text-[#A8D500] light:text-[#90B800]">
                      {item.value}
                    </div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider font-medium text-[#A8A492] light:text-[#8A7B7B] mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="flex items-center gap-2 mt-6">
                {[
                  { href: PROFILE_LINKS.github, label: 'GitHub', icon: Github },
                  { href: PROFILE_LINKS.linkedin, label: 'LinkedIn', icon: ArrowUpRight },
                  { href: PROFILE_LINKS.email, label: 'Email', icon: Mail },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#4F4444] light:bg-[#F4E9D8] border border-[#A8A492]/25 light:border-[#D9CEBB] text-[11px] font-semibold text-[#FCF2E5] light:text-[#524646] hover:border-[#90B800] hover:text-[#A8D500] light:hover:text-[#90B800] transition-all cursor-pointer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon size={14} />
                      <span className="hidden xs:inline sm:inline">{link.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Mono footer */}
              <div className="mt-6 pt-4 border-t border-[#A8A492]/20 light:border-[#EFE3D0] flex items-center justify-between text-[10px] font-mono text-[#A8A492]/80 light:text-[#A8A492]">
                <span className="flex items-center gap-1.5">
                  <Code2 size={11} className="text-[#90B800]" />
                  React · TypeScript · Tailwind
                </span>
                <span>MB-2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
