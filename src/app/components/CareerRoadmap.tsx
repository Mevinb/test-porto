import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, GitBranch, Sparkles, BookOpen, ChevronRight, Calendar, Tag, ExternalLink, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type RoadmapCategory = 'All' | 'AI & Research' | 'Open Source' | 'Hackathons' | 'Milestones';

export interface TimelineNode {
  id: string;
  year: string;
  title: string;
  role: string;
  category: Exclude<RoadmapCategory, 'All'>;
  description: string;
  highlights: string[];
  techStack: string[];
  link?: string;
  linkLabel?: string;
}

const TIMELINE_DATA: TimelineNode[] = [
  {
    id: 't1',
    year: '2026',
    title: 'Story Teller Multi-Agent Engine',
    role: 'Lead AI & Systems Engineer',
    category: 'AI & Research',
    description:
      'Engineered a state-of-the-art multi-agent AI fiction writing framework with real-time SSE event streaming and FAISS semantic memory.',
    highlights: [
      'Designed architectural consensus protocol for Writer, Editor, & Consistency agents',
      'Integrated local GGUF llama.cpp inference alongside Groq & Gemini cloud backends',
      'Implemented high-throughput SSE event streaming with instant scene rollback',
    ],
    techStack: ['Python', 'Flask', 'FAISS', 'Multi-Agent AI', 'SSE Streaming', 'Gemini API'],
    link: 'https://github.com/Mevinb/story-teller-',
    linkLabel: 'View Repository',
  },
  {
    id: 't2',
    year: '2025',
    title: 'ComfyUI Reactorv4 Release',
    role: 'Open Source Creator',
    category: 'Open Source',
    description:
      'Developed high-precision facial swap and identity restoration node suite for Stable Diffusion and ComfyUI workflows.',
    highlights: [
      'Achieved 40% reduction in peak VRAM consumption during batch face swaps',
      'Built automated facial scale mapping & custom LoRA checkpoint blending engine',
      'Gained community adoption with dozens of custom workflow integrations',
    ],
    techStack: ['Python', 'PyTorch', 'ComfyUI Node API', 'InsightFace', 'OpenCV'],
    link: 'https://github.com/Mevinb/Reactorv4',
    linkLabel: 'View Node Suite',
  },
  {
    id: 't3',
    year: '2025',
    title: 'Reactor-Linux Cloud Matrix',
    role: 'DevOps & GPU Architect',
    category: 'Milestones',
    description:
      'Created containerized cloud deployment scripts for executing automated face restoration headless on Linux cloud nodes.',
    highlights: [
      'Automated headless CUDA 12.4 & PyTorch environment setup in single-line script',
      'Integrated automated hardware telemetry and VRAM health monitoring',
      'Deployed on remote server GPU clusters for background rendering pipelines',
    ],
    techStack: ['Bash Shell', 'Python', 'Linux Administration', 'CUDA Toolkit'],
    link: 'https://github.com/Mevinb/reactor-linux',
    linkLabel: 'View Deployment Scripts',
  },
  {
    id: 't4',
    year: '2024',
    title: 'Generative Imaging & Diffusion Research',
    role: 'Independent AI Researcher',
    category: 'AI & Research',
    description:
      'Explored zero-shot face restoration algorithms, prompt conditioning optimization, and local LLM fine-tuning techniques.',
    highlights: [
      'Researched spatial attention masks for identity preservation',
      'Optimized local GGUF quantization formats for consumer GPU inference',
    ],
    techStack: ['Stable Diffusion', 'PyTorch', 'HuggingFace', 'Transformers'],
  },
];

export function CareerRoadmap() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<RoadmapCategory>('All');
  const [expandedId, setExpandedId] = useState<string>('t1');

  const isLight = theme === 'light';

  const categories: RoadmapCategory[] = ['All', 'AI & Research', 'Open Source', 'Milestones'];

  const filteredNodes = TIMELINE_DATA.filter(
    (node) => selectedCategory === 'All' || node.category === selectedCategory
  );

  const getCategoryBadgeClass = (category: RoadmapCategory) => {
    switch (category) {
      case 'AI & Research':
        return 'bg-[#A8A492]/10 text-[#A8A492] border-[#A8A492]/30';
      case 'Open Source':
        return 'bg-[#A8A492]/10 text-[#A8A492] border-[#A8A492]/30';
      case 'Milestones':
        return 'bg-[#90B800]/10 text-[#90B800] border-[#90B800]/30';
      case 'Hackathons':
        return 'bg-[#90B800]/10 text-[#90B800] border-[#90B800]/30';
      default:
        return 'bg-[#90B800]/10 text-[#90B800] border-[#90B800]/30';
    }
  };

  return (
    <div className="w-full my-12">
      {/* Category Pill Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold font-mono text-[#FCF2E5] light:text-[#524646] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#90B800]" /> Career & Innovation Roadmap
          </h3>
          <p className="text-xs text-[#90B800]/70 light:text-[#A8A492] font-sans">
            Interactive trajectory of AI engineering milestones, open-source releases & systems research
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-[#90B800] text-[#3F3636] font-semibold shadow-md'
                  : 'bg-[#463C3C] light:bg-[#F4E9D8] text-[#90B800]/70 light:text-[#524646] hover:bg-[#574B4B] border border-[#90B800]/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Node Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#90B800]/20 light:border-[#C9BEAA] space-y-8">
        {filteredNodes.map((node, index) => {
          const isExpanded = expandedId === node.id;

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Bullet Point Node */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : node.id)}
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${
                  isExpanded
                    ? 'bg-[#90B800] border-[#90B800] shadow-[0_0_15px_#90B800]'
                    : 'bg-[#463D3D] border-[#90B800]/40 hover:border-[#90B800]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-[#3F3636]' : 'bg-[#90B800]'}`} />
              </div>

              {/* Card Container */}
              <div
                className={`bg-[#463D3D]/90 light:bg-white/90 backdrop-blur-xl border rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                  isExpanded
                    ? 'border-[#90B800]/40 shadow-xl'
                    : 'border-[#90B800]/15 light:border-[#D9CEBB] hover:border-[#90B800]/30'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? '' : node.id)}
                  className="flex flex-wrap items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#90B800]/10 border border-[#90B800]/25 text-[#90B800]">
                      {node.year}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${getCategoryBadgeClass(node.category)}`}>
                      {node.category}
                    </span>
                    <h4 className="text-base font-bold text-[#FCF2E5] light:text-[#524646] group-hover:text-[#90B800] transition-colors font-mono">
                      {node.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#90B800]/60">
                    <span>{node.role}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-[#90B800]' : ''}`} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#90B800]/70 light:text-[#8A7B7B] mt-2 font-sans leading-relaxed">
                  {node.description}
                </p>

                {/* Expandable Details Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-[#90B800]/15 light:border-[#D9CEBB] space-y-3">
                        <h5 className="text-xs font-mono text-[#90B800] light:text-[#524646] uppercase tracking-wider font-semibold">
                          Key Deliverables & Innovations
                        </h5>
                        <ul className="space-y-1.5 text-xs text-[#90B800]/80 light:text-[#8A7B7B] font-sans">
                          {node.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-[#90B800] mt-0.5 shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {node.techStack.map((tech) => (
                              <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#90B800]/10 border border-[#90B800]/20 text-[#90B800]">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {node.link && (
                            <a
                              href={node.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-mono text-[#90B800] hover:underline"
                            >
                              <span>{node.linkLabel || 'Learn More'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
