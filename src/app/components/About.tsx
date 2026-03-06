import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Code, Sparkles, Layers, Wrench } from 'lucide-react';

const skillCategories = [
  {
    title: 'Backend',
    icon: Code,
    skills: [
      { name: 'Flask' },
      { name: 'FastAPI' },
      { name: 'Node.js' },
      { name: 'Express.js' },
    ],
  },
  {
    title: 'AI & Image Generation',
    icon: Sparkles,
    skills: [
      { name: 'Stable Diffusion' },
      { name: 'ComfyUI' },
      { name: 'LoRA Training' },
      { name: 'Prompt Engineering' },
    ],
  },
  {
    title: 'Frontend & Languages',
    icon: Layers,
    skills: [
      { name: 'React' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'Kotlin' },
      { name: 'C' },
    ],
  },
  {
    title: 'Tools',
    icon: Wrench,
    skills: [
      { name: 'Docker' },
      { name: 'Git' },
      { name: 'PyInstaller' },
    ],
  },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="min-h-screen py-20 px-6 relative">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_#334155_1px,_transparent_0)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 text-indigo-400"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-slate-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              A passionate software engineer with expertise spanning AI engineering, image generation workflows, and full-stack solutions.
            </motion.p>
          </div>

          <div id="skills" className="mt-20">
            <motion.h3
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-100"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Technical Skills
            </motion.h3>

            <div className="grid md:grid-cols-2 gap-8">
              {skillCategories.map((category, idx) => (
                <motion.div
                  key={category.title}
                  className="relative bg-slate-900/50 backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-8 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Subtle gradient background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl" />
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-3 rounded-lg bg-indigo-600/20 border border-indigo-500/20">
                      <category.icon className="text-indigo-400" size={24} />
                    </div>
                    <h4 className="text-xl font-semibold text-slate-100">{category.title}</h4>
                  </div>

                  <div className="space-y-4 relative z-10">
                    {category.skills.map((skill, skillIdx) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.7 + idx * 0.1 + skillIdx * 0.05 }}
                      >
                        <span className="text-slate-300 font-medium">{skill.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

