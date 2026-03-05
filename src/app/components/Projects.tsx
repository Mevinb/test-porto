import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';

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

// Fallback so the section stays populated if GitHub API is unavailable.
const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    title: 'NetScan',
    description: PROJECT_SUMMARIES.NetScan,
    tags: ['Python', 'Security', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/NetScan',
    primaryUrl: 'https://github.com/Mevinb/NetScan',
    primaryLabel: 'View Repository',
  },
  {
    title: 'db',
    description: PROJECT_SUMMARIES.db,
    tags: ['TypeScript', 'Full Stack', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/db',
    primaryUrl: 'https://github.com/Mevinb/db',
    primaryLabel: 'View Repository',
  },
  {
    title: 'Reactorv3',
    description: PROJECT_SUMMARIES.Reactorv3,
    tags: ['Python', 'AI', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/Reactorv3',
    primaryUrl: 'https://github.com/Mevinb/Reactorv3',
    primaryLabel: 'View Repository',
  },
  {
    title: 'cloudx',
    description: PROJECT_SUMMARIES.cloudx,
    tags: ['TypeScript', 'Node.js', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/cloudx',
    primaryUrl: 'https://github.com/Mevinb/cloudx',
    primaryLabel: 'View Repository',
  },
  {
    title: 'Riftory',
    description: PROJECT_SUMMARIES.Riftory,
    tags: ['TypeScript', 'Web', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/Riftory',
    primaryUrl: 'https://github.com/Mevinb/Riftory',
    primaryLabel: 'View Repository',
  },
  {
    title: 'sn1per-win',
    description: PROJECT_SUMMARIES['sn1per-win'],
    tags: ['PowerShell', 'Security', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/sn1per-win',
    primaryUrl: 'https://github.com/Mevinb/sn1per-win',
    primaryLabel: 'View Repository',
  },
  {
    title: 'etlabshr',
    description: PROJECT_SUMMARIES.etlabshr,
    tags: ['Python', 'API', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/etlabshr',
    primaryUrl: 'https://github.com/Mevinb/etlabshr',
    primaryLabel: 'View Repository',
  },
  {
    title: 'persona',
    description: PROJECT_SUMMARIES.persona,
    tags: ['Python', 'AI', 'GitHub'],
    repoUrl: 'https://github.com/Mevinb/persona',
    primaryUrl: 'https://github.com/Mevinb/persona',
    primaryLabel: 'View Repository',
  },
];

function buildTags(repo: GitHubRepo): string[] {
  const tags: string[] = [];

  if (repo.language) {
    tags.push(repo.language);
  }

  if (repo.homepage && repo.homepage.trim().length > 0) {
    tags.push('Live');
  }

  tags.push('GitHub');
  return [...new Set(tags)].slice(0, 4);
}

function mapRepoToProject(repo: GitHubRepo): PortfolioProject {
  const hasHomepage = Boolean(repo.homepage && repo.homepage.trim().length > 0);
  const summary = PROJECT_SUMMARIES[repo.name] || repo.description?.trim();

  return {
    title: repo.name,
    description: summary || `A ${repo.language ?? 'software'} project by Mevin Benty.`,
    tags: buildTags(repo),
    repoUrl: repo.html_url,
    primaryUrl: hasHomepage ? repo.homepage!.trim() : repo.html_url,
    primaryLabel: hasHomepage ? 'View Live Project' : 'View Repository',
  };
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PROJECTS);

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
          .map(mapRepoToProject);

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

  return (
    <section id="projects" className="min-h-screen py-20 px-6 relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]" />
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
              Featured Projects
            </motion.h2>
            <motion.p
              className="text-slate-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              A showcase of key repositories demonstrating expertise across backend, security, and AI development.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.title}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6 overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <motion.a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} repository`}
                      className="text-slate-400 group-hover:text-indigo-400 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github size={24} />
                    </motion.a>
                  </div>

                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-800/80 border border-indigo-500/10 rounded-full text-xs text-slate-300 group-hover:border-indigo-500/30 group-hover:bg-indigo-950/30 transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.a
                    href={project.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-indigo-400 font-medium cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <span>{project.primaryLabel}</span>
                    <ExternalLink size={16} />
                  </motion.a>
                </div>

                {/* Glow Effect */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
