import { motion } from 'motion/react';
import { Github, Mail } from 'lucide-react';

const PROFILE_LINKS = {
  github: 'https://github.com/Mevinb',
  email: 'mailto:mevinbenty507@gmail.com',
};

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950/50 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-indigo-400 text-sm font-medium tracking-wide uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Software Engineer & Security Specialist
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-slate-100 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Building secure, scalable systems and real-world engineering solutions
          </motion.h1>

          <motion.p
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Full-stack developer specializing in backend architecture, cybersecurity, and creating innovative solutions that solve complex problems.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.a
              href={PROFILE_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-indigo-600 rounded-lg text-white font-medium shadow-lg shadow-indigo-500/30 overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <Github size={20} />
                View GitHub
              </span>
            </motion.a>

            <motion.a
              href={PROFILE_LINKS.email}
              className="group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg text-slate-200 font-medium hover:border-indigo-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative flex items-center gap-2">
                <Mail size={20} />
                Email Me
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-indigo-400 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
