import { motion, AnimatePresence, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  Github,
  ExternalLink,
  Shield,
  Cpu,
  Code,
  Globe,
  Smartphone,
  CheckCircle2,
  X,
  Star,
  GitFork,
  Terminal,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ArchitectureModal, ProjectArchitecture } from './ArchitectureModal';
import { GithubStats } from './GithubStats';

export const PROJECT_ARCHITECTURES: Record<string, ProjectArchitecture> = {
  'story-teller': {
    projectId: 'story-teller',
    projectTitle: 'Story Teller Engine Architecture',
    pipelineDescription: 'Multi-Agent LLM narrative engine with SSE streaming & vector story memory',
    nodes: [
      { id: 'n1', name: 'User Prompt Input', type: 'input', description: 'Ingests chapter requirements, outline parameters, and target tone.', tech: 'Flask REST API' },
      { id: 'n2', name: 'Architect & Planner Agent', type: 'process', description: 'Decomposes narrative into detailed scene sub-tasks and character goals.', tech: 'LangChain Agent' },
      { id: 'n3', name: 'FAISS Vector Memory', type: 'storage', description: 'Queries past chapter lore and character continuity vectors.', tech: 'FAISS / Sent-Transformers', latency: '4ms' },
      { id: 'n4', name: 'LLM Generation & Editor', type: 'model', description: 'Executes scene writing pass with real-time SSE token streaming.', tech: 'Llama.cpp / Gemini API', vram: '6.4 GB', latency: '420ms' },
      { id: 'n5', name: 'SSE Client Stream', type: 'output', description: 'Pushes live Markdown narrative directly to user editor UI.', tech: 'Server-Sent Events' },
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
    ],
  },
  Reactorv4: {
    projectId: 'Reactorv4',
    projectTitle: 'Reactorv4 Face Restoration Pipeline',
    pipelineDescription: 'ComfyUI node suite for identity preservation & facial swapping',
    nodes: [
      { id: 'r1', name: 'Identity Source Image', type: 'input', description: 'Loads target face image and calculates identity embedding vector.', tech: 'OpenCV / PIL' },
      { id: 'r2', name: 'InsightFace Feature Extractor', type: 'process', description: 'Detects 68 facial keypoints & computes 512D face embeddings.', tech: 'InsightFace / ONNX', latency: '18ms' },
      { id: 'r3', name: 'ComfyUI Sampler Node', type: 'model', description: 'Applies identity swap tensor during latent space diffusion sampling.', tech: 'PyTorch / Stable Diffusion', vram: '8.2 GB', latency: '850ms' },
      { id: 'r4', name: 'CodeFormer Enhancer', type: 'process', description: 'Performs high-resolution facial feature restoration and upscaling.', tech: 'CodeFormer / PyTorch', latency: '120ms' },
      { id: 'r5', name: 'Enhanced Composite Output', type: 'output', description: 'Blends restitched face back onto target composite image canvas.', tech: 'PNG Export / ComfyUI Node' },
    ],
    connections: [
      { from: 'r1', to: 'r2' },
      { from: 'r2', to: 'r3' },
      { from: 'r3', to: 'r4' },
      { from: 'r4', to: 'r5' },
    ],
  },
  'reactor-linux': {
    projectId: 'reactor-linux',
    projectTitle: 'Reactor Linux GPU Automated Deployment',
    pipelineDescription: 'Headless CUDA driver installer and GPU orchestration matrix',
    nodes: [
      { id: 'l1', name: 'Cloud Instance Trigger', type: 'input', description: 'Initiates automated installation on cloud GPU instances.', tech: 'Bash / SSH' },
      { id: 'l2', name: 'CUDA 12.4 Setup', type: 'process', description: 'Automates installation of NVIDIA drivers, CUDA Toolkit & PyTorch.', tech: 'APT / Shell Scripts', latency: '45s' },
      { id: 'l3', name: 'Dependency Resolver', type: 'process', description: 'Installs ONNXRuntime-GPU, OpenCV, and ComfyUI dependencies.', tech: 'Pip / Virtualenv' },
      { id: 'l4', name: 'VRAM Health Telemetry', type: 'storage', description: 'Monitors GPU memory allocation and thermal health metrics.', tech: 'NVIDIA-SMI / Python' },
      { id: 'l5', name: 'Headless Service Active', type: 'output', description: 'Spawns background inference workers ready for REST API calls.', tech: 'Systemd Service' },
    ],
    connections: [
      { from: 'l1', to: 'l2' },
      { from: 'l2', to: 'l3' },
      { from: 'l3', to: 'l4' },
      { from: 'l4', to: 'l5' },
    ],
  },
};

export type Category = 'All' | 'AI & Vision' | 'Security & Systems' | 'Web & Cloud' | 'Mobile';

export interface DetailedProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: Exclude<Category, 'All'>;
  tags: string[];
  features: string[];
  techStack: string[];
  repoUrl: string;
  primaryUrl: string;
  primaryLabel: string;
  stars?: number;
  forks?: number;
  language: string;
}

const CATEGORIES: Category[] = ['All', 'AI & Vision', 'Security & Systems', 'Web & Cloud', 'Mobile'];

const DETAILED_PROJECTS: DetailedProject[] = [
  {
    id: 'story-teller',
    title: 'Story Teller',
    tagline: 'Multi-Agent AI Fiction Generation & Semantic Story Memory System',
    description:
      'A multi-agent AI fiction generation engine for writing long-form stories chapter by chapter. Features collaborating agents (Architect, Planner, Writer, Consistency Engine, Editor), real-time SSE generation streaming, FAISS semantic story memory, and pluggable backends (llama.cpp, Groq, Gemini, OpenRouter).',
    category: 'AI & Vision',
    tags: ['Python', 'Multi-Agent AI', 'FAISS', 'Flask', 'LLM'],
    features: [
      'Multi-agent pipeline (Architect, Planner, Writer, Consistency, Editor)',
      'Real-time SSE event streaming UI & interactive manual scene writing',
      'Semantic story memory with FAISS & sentence-transformers vector store',
      'Pluggable backends: Local GGUF (llama.cpp), Groq, Gemini & OpenRouter',
    ],
    techStack: ['Python', 'Flask', 'FAISS', 'Llama.cpp', 'Gemini API', 'Groq API', 'SSE Streaming'],
    repoUrl: 'https://github.com/Mevinb/story-teller-',
    primaryUrl: 'https://github.com/Mevinb/story-teller-',
    primaryLabel: 'View Repository',
    language: 'Python',
  },
  {
    id: 'Reactorv4',
    title: 'Reactorv4',
    tagline: 'High-Performance ComfyUI Facial Restoration & Identity Pipeline',
    description:
      'Advanced face restoration and identity swap node extension designed for ComfyUI and Stable Diffusion workflows. Features high-resolution face enhancement, custom checkpoint blending, and identity preservation across complex prompt matrices.',
    category: 'AI & Vision',
    tags: ['Python', 'ComfyUI', 'Stable Diffusion', 'Facial AI'],
    features: [
      'High-resolution identity-preserving face swapping',
      'Seamless integration into custom ComfyUI node graphs',
      'Optimized VRAM allocation for large batch inference',
      'Support for custom model weights and LoRA blending',
    ],
    techStack: ['Python', 'PyTorch', 'ComfyUI Node API', 'OpenCV', 'InsightFace'],
    repoUrl: 'https://github.com/Mevinb/Reactorv4',
    primaryUrl: 'https://github.com/Mevinb/Reactorv4',
    primaryLabel: 'View Repository',
    language: 'Python',
  },
  {
    id: 'reactor-linux',
    title: 'reactor-linux',
    tagline: 'Linux GPU Automated Build & Deployment Matrix for Reactor',
    description:
      'Dedicated Linux build, dependency orchestrator, and GPU driver setup scripts for executing Reactor face restoration pipelines headlessly across Linux cloud servers.',
    category: 'AI & Vision',
    tags: ['Python', 'Linux', 'DevOps', 'GPU Automation'],
    features: [
      'Automated headless installation of CUDA and CUDNN environments',
      'One-click dependency installation for Linux server nodes',
      'Automated system health and VRAM telemetry checks',
      'Containerized execution scripts for cloud deployments',
    ],
    techStack: ['Python', 'Bash Shell', 'CUDA Toolkit', 'Linux Administration'],
    repoUrl: 'https://github.com/Mevinb/reactor-linux',
    primaryUrl: 'https://github.com/Mevinb/reactor-linux',
    primaryLabel: 'View Repository',
    language: 'Python',
  },
  {
    id: 'sn1per-win',
    title: 'sn1per-win',
    tagline: 'Automated Reconnaissance & Security Scanner for Windows',
    description:
      'A native PowerShell port of the Sn1per security scanner. Automates security auditing, port discovery, vulnerability detection, and active threat surface assessments on Windows targets.',
    category: 'Security & Systems',
    tags: ['PowerShell', 'Windows Sec', 'Auditing', 'Pentesting'],
    features: [
      'Automated host discovery and port range scanning',
      'Vulnerability signature matching for Windows services',
      'Structured HTML and JSON security audit report generation',
      'Native execution without external heavy dependencies',
    ],
    techStack: ['PowerShell', 'Windows API', 'Network Socketing', 'Security Reporting'],
    repoUrl: 'https://github.com/Mevinb/sn1per-win',
    primaryUrl: 'https://github.com/Mevinb/sn1per-win',
    primaryLabel: 'View Repository',
    language: 'PowerShell',
  },
  {
    id: 'NetScan',
    title: 'NetScan',
    tagline: 'Active IP Discovery, Port Mapper & Device Fingerprinting Tool',
    description:
      'Lightweight python network scanner built to quickly discover active hosts on local subnets, perform port banners analysis, and identify connected hardware devices.',
    category: 'Security & Systems',
    tags: ['Python', 'Network Sec', 'IP Scanner', 'Socket'],
    features: [
      'Multithreaded subnet ping sweep and active IP identification',
      'Port banner grabbing for service detection',
      'MAC address lookup and vendor identification',
      'Exportable scan results into JSON & CSV formats',
    ],
    techStack: ['Python', 'Scapy', 'Socket API', 'Threaded Execution'],
    repoUrl: 'https://github.com/Mevinb/NetScan',
    primaryUrl: 'https://github.com/Mevinb/NetScan',
    primaryLabel: 'View Repository',
    language: 'Python',
  },
  {
    id: 'ai-analysis',
    title: 'ai-analysis',
    tagline: 'Automated Multi-Modal Data Analytics & Insight Engine',
    description:
      'TypeScript data analysis engine leveraging LLM interfaces to parse raw data streams, compute telemetry trends, and output structured actionable intelligence reports.',
    category: 'AI & Vision',
    tags: ['TypeScript', 'LLM API', 'Analytics', 'Node.js'],
    features: [
      'Automated data cleaning and pattern recognition',
      'LLM-driven anomaly detection and telemetry summary',
      'Interactive chart data generation for client visualization',
      'Extensible API connectors for external databases',
    ],
    techStack: ['TypeScript', 'Node.js', 'OpenAI / Gemini API', 'Tailwind CSS'],
    repoUrl: 'https://github.com/Mevinb/ai-analysis',
    primaryUrl: 'https://github.com/Mevinb/ai-analysis',
    primaryLabel: 'View Repository',
    language: 'TypeScript',
  },
  {
    id: 'cloudx',
    title: 'cloudx',
    tagline: 'Cloud Infrastructure Management & LMS Platform Engine',
    description:
      'Full-stack cloud application platform for course management, virtual labs, user role permissions, and scalable content delivery.',
    category: 'Web & Cloud',
    tags: ['TypeScript', 'React', 'Node.js', 'Express'],
    features: [
      'Role-based access control (Admin, Student, Instructor)',
      'Real-time course analytics and progress tracking',
      'Secure authentication with JWT and bcrypt hashing',
      'Responsive dashboard with glassmorphism UI components',
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    repoUrl: 'https://github.com/Mevinb/cloudx',
    primaryUrl: 'https://github.com/Mevinb/cloudx',
    primaryLabel: 'View Repository',
    language: 'TypeScript',
  },
  {
    id: 'Riftory',
    title: 'Riftory',
    tagline: 'Modern Web Application Platform with Real-Time Component Architecture',
    description:
      'Modular web application project showcasing high-performance component rendering, clean state flows, and reactive UI architecture.',
    category: 'Web & Cloud',
    tags: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
    features: [
      'Component-driven UI architecture',
      'Optimized DOM rendering with zero runtime overhead',
      'Custom theme CSS tokens and dark mode support',
      'Modular state management pattern',
    ],
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
    repoUrl: 'https://github.com/Mevinb/Riftory',
    primaryUrl: 'https://github.com/Mevinb/Riftory',
    primaryLabel: 'View Repository',
    language: 'TypeScript',
  },
  {
    id: 'persona',
    title: 'persona',
    tagline: 'Modular Autonomous AI Agent & Local Persona Engine',
    description:
      'Private Python AI assistant framework enabling custom persona configurations, memory buffer management, and local prompt execution pipelines.',
    category: 'AI & Vision',
    tags: ['Python', 'Local AI', 'Agent', 'Prompt Matrix'],
    features: [
      'Configurable AI persona profiles and system instructions',
      'Local vector store for contextual chat memory',
      'Modular tool calling integration for system commands',
      'Privacy-focused offline execution capabilities',
    ],
    techStack: ['Python', 'LangChain / LlamaIndex', 'SQLite', 'Local LLM API'],
    repoUrl: 'https://github.com/Mevinb/persona',
    primaryUrl: 'https://github.com/Mevinb/persona',
    primaryLabel: 'View Repository',
    language: 'Python',
  },
  {
    id: 'mobille',
    title: 'mobille',
    tagline: 'Native Android Mobile Workflow Application',
    description:
      'Native Android mobile application built with Kotlin, featuring modern Jetpack Compose architecture, asynchronous Coroutines, and RESTful API integrations.',
    category: 'Mobile',
    tags: ['Kotlin', 'Android', 'Jetpack Compose', 'REST API'],
    features: [
      'Jetpack Compose declarative UI interface',
      'Kotlin Coroutines for smooth background network requests',
      'Offline caching layer using Room Database',
      'Clean MVVM architectural design pattern',
    ],
    techStack: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Retrofit', 'Room DB'],
    repoUrl: 'https://github.com/Mevinb/mobille',
    primaryUrl: 'https://github.com/Mevinb/mobille',
    primaryLabel: 'View Repository',
    language: 'Kotlin',
  },
  {
    id: 'sharing-and-renting-agricultural-equipment',
    title: 'AgriRent Platform',
    tagline: 'Agricultural Equipment Sharing & Rental Management System',
    description:
      'Full-stack AgriTech web application designed for farmers to list, discover, and rent heavy machinery, with booking schedules and equipment verification.',
    category: 'Web & Cloud',
    tags: ['TypeScript', 'React', 'Node.js', 'AgriTech'],
    features: [
      'Equipment catalog search with geo-location filters',
      'Booking schedule calendar and availability validation',
      'Direct messaging between equipment owners and renters',
      'Transparent pricing calculator with deposit management',
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    repoUrl: 'https://github.com/Mevinb/sharing-and-renting-agricultural-equipment',
    primaryUrl: 'https://github.com/Mevinb/sharing-and-renting-agricultural-equipment',
    primaryLabel: 'View Repository',
    language: 'TypeScript',
  },
];

function getCategoryIcon(category: DetailedProject['category']) {
  switch (category) {
    case 'AI & Vision':
      return <Cpu size={15} className="text-[#90B800] light:text-[#90B800]" />;
    case 'Security & Systems':
      return <Shield size={15} className="text-[#A8A492] light:text-[#90B800]" />;
    case 'Web & Cloud':
      return <Globe size={15} className="text-[#90B800] light:text-[#90B800]" />;
    case 'Mobile':
      return <Smartphone size={15} className="text-[#A8A492] light:text-[#90B800]" />;
  }
}

// ── Detailed Project Modal Component ───────────────────────────────────────────
function ProjectDetailModal({
  project,
  onClose,
  onViewArch,
}: {
  project: DetailedProject;
  onClose: () => void;
  onViewArch: (arch: ProjectArchitecture) => void;
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const archData = PROJECT_ARCHITECTURES[project.id];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#3F3636]/80 light:bg-[#524646]/60 backdrop-blur-md overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl bg-[#5E5252] light:bg-white border border-[#90B800]/25 light:border-[#D9CEBB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#524646]/90 light:shadow-[#A8A492]/40 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-[#524646]/80 light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[#A8A492] light:text-[#8A7B7B] hover:text-[#FCF2E5] light:hover:text-[#524646] transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Badge & Category */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[11px] font-semibold uppercase tracking-wider text-[#A8A492] light:text-[#524646]">
            {getCategoryIcon(project.category)}
            <span>{project.category}</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#90B800]/10 light:bg-[#90B800]/10 text-[#90B800] light:text-[#90B800] font-mono font-medium">
            {project.language}
          </span>
        </div>

        {/* Project Title & Tagline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FCF2E5] light:text-[#524646] tracking-tight mb-2">
          {project.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#90B800] light:text-[#90B800] font-semibold mb-6">
          {project.tagline}
        </p>

        {/* Overview Section */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8A492] light:text-[#A8A492] mb-2">
            Overview
          </h4>
          <p className="text-xs sm:text-sm text-[#A8A492] light:text-[#8A7B7B] leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Key Features List */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8A492] light:text-[#A8A492] mb-3">
            Key Architecture & Features
          </h4>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {project.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#524646]/70 light:bg-[#F7EBDD] border border-[#90B800]/15 light:border-[#D9CEBB]/80 text-xs text-[#FCF2E5] light:text-[#524646]"
              >
                <CheckCircle2 size={15} className="text-[#90B800] light:text-[#90B800] shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Breakdown */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8A492] light:text-[#A8A492] mb-2.5">
            Technologies Used
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1 rounded-lg bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[#A8A492] light:text-[#524646] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Action Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#90B800]/15 light:border-[#D9CEBB]">
          <div className="flex items-center gap-3 text-xs text-[#A8A492] light:text-[#A8A492]">
            <span className="flex items-center gap-1">
              <Terminal size={14} className="text-[#90B800] light:text-[#90B800]" />
              <span>Public Repository</span>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {archData && (
              <button
                onClick={() => {
                  onClose();
                  onViewArch(archData);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#90B800]/15 hover:bg-[#90B800]/25 text-[#90B800] border border-[#90B800]/30 text-xs font-bold rounded-xl transition-all"
              >
                <Layers size={15} />
                <span>View Architecture Diagram</span>
              </button>
            )}

            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#90B800] light:bg-[#90B800] hover:bg-[#A8D500] light:hover:bg-[#789900] text-[#524646] light:text-[#FCF2E5] text-xs font-bold rounded-xl shadow-lg shadow-[#90B800]/20 light:shadow-[#90B800]/20 cursor-pointer transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Github size={15} />
              <span>View on GitHub</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project Card Component ───────────────────────────────────────────────────
function ProjectCard({
  project,
  onSelect,
  onOpenArch,
}: {
  project: DetailedProject;
  onSelect: (project: DetailedProject) => void;
  onOpenArch?: (arch: ProjectArchitecture) => void;
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
  const spotlightColor = isLight ? 'rgba(144, 184, 0, 0.12)' : 'rgba(144, 184, 0, 0.15)';
  const archData = PROJECT_ARCHITECTURES[project.id];

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(project)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/15 light:border-[#D9CEBB]/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between hover:bg-[#5E5252] light:hover:bg-white hover:border-[#90B800]/35 light:hover:border-[#C9BEAA] transition-all duration-300 h-full shadow-lg light:shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer"
    >
      {/* Border hover spotlight glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#524646] light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] text-[10px] font-semibold uppercase tracking-wider text-[#A8A492] light:text-[#524646]">
            {getCategoryIcon(project.category)}
            <span>{project.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {archData && onOpenArch && (
              <button
                title="View System Architecture Diagram"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenArch(archData);
                }}
                className="flex items-center justify-center p-2 rounded-xl bg-[#90B800]/10 border border-[#90B800]/20 hover:border-[#90B800] text-[#90B800] transition-colors cursor-pointer"
              >
                <Layers size={15} />
              </button>
            )}

            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open GitHub Repository"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center p-2 rounded-xl bg-[#524646]/80 light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] hover:border-[#90B800] light:hover:border-[#90B800] hover:bg-[#90B800]/10 light:hover:bg-[#90B800]/10 text-[#A8A492] light:text-[#A8A492] hover:text-[#90B800] light:hover:text-[#90B800] transition-colors cursor-pointer"
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github size={17} />
            </motion.a>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg sm:text-xl font-bold text-[#FCF2E5] light:text-[#524646] mb-1 group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors duration-300 flex items-center justify-between">
          <span>{project.title}</span>
          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#90B800] light:text-[#90B800]" />
        </h3>
        <p className="text-xs text-[#90B800] light:text-[#90B800] font-semibold mb-3">
          {project.tagline}
        </p>

        {/* Short Description */}
        <p className="text-[#A8A492] light:text-[#8A7B7B] text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Feature Preview Badges */}
        <div className="space-y-1.5 mb-4">
          {project.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#A8A492] light:text-[#524646]">
              <Zap size={12} className="text-[#90B800] light:text-[#90B800] shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-3.5 border-t border-[#90B800]/10 light:border-[#D9CEBB]/80 flex items-center justify-between gap-2">
        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#524646]/60 light:bg-[#F4E9D8] border border-[#90B800]/15 light:border-[#D9CEBB] text-[#A8A492] light:text-[#8A7B7B] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {archData && onOpenArch && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenArch(archData);
            }}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#90B800]/10 hover:bg-[#90B800]/20 text-[#90B800] border border-[#90B800]/25 transition-all whitespace-nowrap"
          >
            Diagram
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Projects Showcase Section ─────────────────────────────────────────────
export function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedProject, setSelectedProject] = useState<DetailedProject | null>(null);
  const [activeArch, setActiveArch] = useState<ProjectArchitecture | null>(null);

  const filteredProjects = DETAILED_PROJECTS.filter(
    (project) => activeCategory === 'All' || project.category === activeCategory
  );

  return (
    <section id="projects" ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-[#90B800]/5 light:bg-[#90B800]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div className="max-w-xl text-left">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#90B800] light:text-[#90B800] mb-2 sm:mb-3"
            >
              Curated Showcase
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-4xl font-extrabold text-[#FCF2E5] light:text-[#524646] tracking-tight"
            >
              Featured GitHub Repositories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs sm:text-sm text-[#A8A492] light:text-[#8A7B7B] mt-2 sm:mt-3 leading-relaxed"
            >
              Explore detailed architectural breakdowns, key features, and source code of production-ready AI pipelines, security scanners, and web applications.
            </motion.p>
          </div>

          {/* Dynamic Filter Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-1.5 p-1 bg-[#524646]/80 light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#D9CEBB] rounded-xl sm:rounded-2xl max-w-full overflow-x-auto no-scrollbar scrollbar-none md:self-end"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive 
                      ? 'text-[#524646] light:text-[#FCF2E5] font-semibold' 
                      : 'text-[#A8A492] light:text-[#8A7B7B] hover:text-[#FCF2E5] light:hover:text-[#524646]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-[#90B800] light:bg-[#90B800] rounded-lg sm:rounded-xl -z-10 shadow-[0_0_15px_rgba(144, 184, 0,0.35)] light:shadow-[0_0_15px_rgba(144, 184, 0,0.25)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {category}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  onSelect={setSelectedProject}
                  onOpenArch={(arch) => setActiveArch(arch)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Live GitHub Telemetry Component */}
        <GithubStats />
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onViewArch={(arch) => setActiveArch(arch)}
          />
        )}
      </AnimatePresence>

      {/* System Architecture Modal */}
      <ArchitectureModal
        isOpen={!!activeArch}
        onClose={() => setActiveArch(null)}
        architecture={activeArch || undefined}
      />
    </section>
  );
}
