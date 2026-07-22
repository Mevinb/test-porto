import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Github, ExternalLink, Shield, Cpu, Code, Globe } from 'lucide-react';

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

type PortfolioProject = {
  title: string;
  description: string;
  tags: string[];
  repoUrl: string;
  primaryUrl: string;
  primaryLabel: string;
  category: 'AI & Vision' | 'Security & Systems' | 'Web Apps';
};

const GITHUB_REPOS_API = 'https://api.github.com/users/Mevinb/repos?per_page=100&sort=updated';
const CURATED_REPOSITORIES = [
  'NetScan',
  'db',
  'Reactorv3',
  'cloudx',
  'Riftory',
  'sn1per-win',
  'etlabshr',
  'persona',
] as const;
const CURATED_REPO_SET = new Set<string>(CURATED_REPOSITORIES);

const PROJECT_SUMMARIES: Record<string, string> = {
  NetScan:
    'A comprehensive security toolkit for network discovery, vulnerability scanning, and log analysis.',
  db:
    'A full-stack system for managing departments, courses, attendance, and examinations with role-based access.',
  Reactorv3:
    'Professional-grade facial restoration pipeline focused on high-resolution identity-preserving enhancement.',
  cloudx:
    'A full-stack learning management platform built with Node.js/Express and React/TypeScript.',
  Riftory: 'A TypeScript project focused on modern web application development workflows.',
  'sn1per-win':
    'A complete PowerShell port of the Sn1per security toolkit for Windows-based assessments.',
  etlabshr:
    'Unofficial API for the Sahrdaya Etlab portal supporting attendance, timetable, and profile workflows.',
  persona:
    'A local, modular personal AI assistant built in Python for private and customizable AI workflows.',
};

function getCategoryForRepo(name: string): 'AI & Vision' | 'Security & Systems' | 'Web Apps' {
  if (name === 'Reactorv3' || name === 'persona') {
    return 'AI & Vision';
  }
  if (name === 'NetScan' || name === 'sn1per-win' || name === 'etlabshr') {
    return 'Security & Systems';
  }
  return 'Web Apps';
}

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    title: 'NetScan',
    description: PROJECT_SUMMARIES.NetScan,
    tags: ['Python', 'Security', 'Scanner'],
    repoUrl: 'https://github.com/Mevinb/NetScan',
    primaryUrl: 'https://github.com/Mevinb/NetScan',
    primaryLabel: 'View Repository',
    category: 'Security & Systems',
  },
  {
    title: 'db',
    description: PROJECT_SUMMARIES.db,
    tags: ['TypeScript', 'Node.js', 'PostgreSQL'],
    repoUrl: 'https://github.com/Mevinb/db',
    primaryUrl: 'https://github.com/Mevinb/db',
    primaryLabel: 'View Repository',
    category: 'Web Apps',
  },
  {
    title: 'Reactorv3',
    description: PROJECT_SUMMARIES.Reactorv3,
    tags: ['Python', 'Stable Diffusion', 'Facial AI'],
    repoUrl: 'https://github.com/Mevinb/Reactorv3',
    primaryUrl: 'https://github.com/Mevinb/Reactorv3',
    primaryLabel: 'View Repository',
    category: 'AI & Vision',
  },
  {
    title: 'cloudx',
    description: PROJECT_SUMMARIES.cloudx,
    tags: ['TypeScript', 'Express', 'React'],
    repoUrl: 'https://github.com/Mevinb/cloudx',
    primaryUrl: 'https://github.com/Mevinb/cloudx',
    primaryLabel: 'View Repository',
    category: 'Web Apps',
  },
  {
    title: 'Riftory',
    description: PROJECT_SUMMARIES.Riftory,
    tags: ['TypeScript', 'Webpack', 'CSS'],
    repoUrl: 'https://github.com/Mevinb/Riftory',
    primaryUrl: 'https://github.com/Mevinb/Riftory',
    primaryLabel: 'View Repository',
    category: 'Web Apps',
  },
  {
    title: 'sn1per-win',
    description: PROJECT_SUMMARIES['sn1per-win'],
    tags: ['PowerShell', 'Windows Sec', 'Auditing'],
    repoUrl: 'https://github.com/Mevinb/sn1per-win',
    primaryUrl: 'https://github.com/Mevinb/sn1per-win',
    primaryLabel: 'View Repository',
    category: 'Security & Systems',
  },
  {
    title: 'etlabshr',
    description: PROJECT_SUMMARIES.etlabshr,
    tags: ['Python', 'Web API', 'Automation'],
    repoUrl: 'https://github.com/Mevinb/etlabshr',
    primaryUrl: 'https://github.com/Mevinb/etlabshr',
    primaryLabel: 'View Repository',
    category: 'Security & Systems',
  },
  {
    title: 'persona',
    description: PROJECT_SUMMARIES.persona,
    tags: ['Python', 'Local AI', 'Agent'],
    repoUrl: 'https://github.com/Mevinb/persona',
    primaryUrl: 'https://github.com/Mevinb/persona',
    primaryLabel: 'View Repository',
    category: 'AI & Vision',
  },
];

const CATEGORIES = ['All', 'AI & Vision', 'Security & Systems', 'Web Apps'] as const;

function ProjectCard({
  project,
}: {
  project: PortfolioProject;
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

  const getCategoryIcon = () => {
    switch (project.category) {
      case 'AI & Vision':
        return <Cpu size={16} className="text-[#b6d9e0]" />;
      case 'Security & Systems':
        return <Shield size={16} className="text-[#dbe2dc]" />;
      case 'Web Apps':
        return <Code size={16} className="text-[#b6d9e0]" />;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-[#0d1218]/80 backdrop-blur-xl border border-[#b6d9e0]/15 rounded-3xl p-6 flex flex-col justify-between hover:bg-[#0d1218] hover:border-[#b6d9e0]/35 transition-all duration-300 h-full shadow-lg"
    >
      {/* Border hover spotlight glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(182, 217, 224, 0.15), transparent 80%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#080c10] border border-[#b6d9e0]/20 text-[10px] font-semibold uppercase tracking-wider text-[#dbe2dc]">
            {getCategoryIcon()}
            <span>{project.category}</span>
          </div>
          
          <motion.a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-xl bg-[#080c10]/80 border border-[#b6d9e0]/20 hover:border-[#b6d9e0] hover:bg-[#b6d9e0]/10 text-[#8ea4b0] hover:text-[#b6d9e0] transition-colors cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github size={18} />
          </motion.a>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#eef4f6] mb-2 group-hover:text-[#b6d9e0] transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[#8ea4b0] text-xs sm:text-sm leading-relaxed mb-6">
          {project.description}
        </p>
      </div>

      <div className="relative z-10 mt-auto">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-[#080c10]/60 border border-[#b6d9e0]/15 text-[#8ea4b0] group-hover:text-[#dbe2dc] group-hover:border-[#b6d9e0]/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link Button */}
        <motion.a
          href={project.primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b6d9e0] hover:text-[#eef4f6] cursor-pointer"
          whileHover={{ x: 3 }}
        >
          <span>{project.primaryLabel}</span>
          <ExternalLink size={14} />
        </motion.a>
      </div>
    </div>
  );
}

export function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PROJECTS);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch(GITHUB_REPOS_API);
        if (!response.ok) {
          throw new Error(`GitHub API request failed: ${response.status}`);
        }

        const repos = (await response.json()) as GitHubRepo[];

        const repoMap = new Map(
          repos
            .filter((repo) => !repo.fork && !repo.archived && CURATED_REPO_SET.has(repo.name))
            .map((repo) => [repo.name, repo] as const),
        );

        const githubProjects = CURATED_REPOSITORIES.map((name) => repoMap.get(name))
          .filter((repo): repo is GitHubRepo => Boolean(repo))
          .map((repo) => {
            const hasHomepage = Boolean(repo.homepage && repo.homepage.trim().length > 0);
            const summary = PROJECT_SUMMARIES[repo.name] || repo.description?.trim();
            const category = getCategoryForRepo(repo.name);
            const lang = repo.language ?? 'Software';

            return {
              title: repo.name,
              description: summary || `A ${lang.toLowerCase()} project by Mevin Benty.`,
              tags: [lang, hasHomepage ? 'Live' : 'GitHub'].slice(0, 3),
              repoUrl: repo.html_url,
              primaryUrl: hasHomepage ? repo.homepage!.trim() : repo.html_url,
              primaryLabel: hasHomepage ? 'View Live Project' : 'View Repository',
              category,
            };
          });

        if (mounted && githubProjects.length > 0) {
          setProjects(githubProjects);
        }
      } catch {
        if (mounted) {
          setProjects(FALLBACK_PROJECTS);
        }
      }
    };

    void loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProjects = projects.filter(
    (project) => activeCategory === 'All' || project.category === activeCategory
  );

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl text-left">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#b6d9e0] mb-3"
            >
              Showcase
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-[#eef4f6] tracking-tight"
            >
              Curated Repositories
            </motion.h2>
          </div>

          {/* Dynamic Filter Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#080c10]/80 border border-[#b6d9e0]/20 rounded-2xl md:self-end"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive ? 'text-[#080c10] font-semibold' : 'text-[#8ea4b0] hover:text-[#eef4f6]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-[#b6d9e0] rounded-xl -z-10 shadow-[0_0_15px_rgba(182,217,224,0.35)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {category}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Project Grid Container with layout animations */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
