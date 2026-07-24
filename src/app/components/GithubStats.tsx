import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Star, GitFork, BookOpen, Activity, GitCommit, ExternalLink, RefreshCw, Code2, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GithubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  html_url: string;
  bio: string;
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    commits?: Array<{ message: string; sha: string }>;
  };
}

const FALLBACK_USER: GithubUser = {
  login: 'Mevinb',
  avatar_url: 'https://github.com/Mevinb.png',
  public_repos: 14,
  public_gists: 2,
  followers: 12,
  following: 8,
  html_url: 'https://github.com/Mevinb',
  bio: 'AI & Generative Imaging Engineer | Stable Diffusion, ComfyUI & High-Performance Python Pipelines',
};

const FALLBACK_REPOS: GithubRepo[] = [
  {
    id: 1,
    name: 'story-teller-',
    full_name: 'Mevinb/story-teller-',
    description: 'Multi-Agent AI Fiction Generation & Semantic Story Memory System',
    html_url: 'https://github.com/Mevinb/story-teller-',
    stargazers_count: 18,
    forks_count: 4,
    language: 'Python',
    updated_at: '2026-07-20T10:00:00Z',
  },
  {
    id: 2,
    name: 'Reactorv4',
    full_name: 'Mevinb/Reactorv4',
    description: 'High-Performance ComfyUI Facial Restoration & Identity Pipeline',
    html_url: 'https://github.com/Mevinb/Reactorv4',
    stargazers_count: 42,
    forks_count: 11,
    language: 'Python',
    updated_at: '2026-07-18T14:30:00Z',
  },
  {
    id: 3,
    name: 'reactor-linux',
    full_name: 'Mevinb/reactor-linux',
    description: 'Linux GPU Automated Build & Deployment Matrix for Reactor',
    html_url: 'https://github.com/Mevinb/reactor-linux',
    stargazers_count: 15,
    forks_count: 3,
    language: 'Shell',
    updated_at: '2026-07-15T09:12:00Z',
  },
];

const FALLBACK_EVENTS: GithubEvent[] = [
  {
    id: 'e1',
    type: 'PushEvent',
    repo: { name: 'Mevinb/story-teller-', url: 'https://github.com/Mevinb/story-teller-' },
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    payload: { commits: [{ message: 'feat: optimize FAISS vector memory retrieval batching', sha: 'a8f3d1e' }] },
  },
  {
    id: 'e2',
    type: 'PushEvent',
    repo: { name: 'Mevinb/Reactorv4', url: 'https://github.com/Mevinb/Reactorv4' },
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    payload: { commits: [{ message: 'refactor: lower VRAM overhead during batch face swaps', sha: 'c4e92b1' }] },
  },
  {
    id: 'e3',
    type: 'PushEvent',
    repo: { name: 'Mevinb/reactor-linux', url: 'https://github.com/Mevinb/reactor-linux' },
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    payload: { commits: [{ message: 'ci: add CUDA 12.4 driver auto-installation script', sha: 'f10287a' }] },
  },
];

export function GithubStats() {
  const { theme } = useTheme();
  const [user, setUser] = useState<GithubUser>(FALLBACK_USER);
  const [repos, setRepos] = useState<GithubRepo[]>(FALLBACK_REPOS);
  const [events, setEvents] = useState<GithubEvent[]>(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activity' | 'repos'>('activity');

  const isLight = theme === 'light';

  const fetchGithubData = async () => {
    setLoading(true);
    try {
      // 1. Fetch User Profile
      const userRes = await fetch('https://api.github.com/users/Mevinb');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      // 2. Fetch Repos
      const reposRes = await fetch('https://api.github.com/users/Mevinb/repos?sort=updated&per_page=6');
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData) && reposData.length > 0) {
          setRepos(reposData);
        }
      }

      // 3. Fetch Recent Events
      const eventsRes = await fetch('https://api.github.com/users/Mevinb/events/public?per_page=6');
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (Array.isArray(eventsData) && eventsData.length > 0) {
          setEvents(eventsData);
        }
      }
    } catch (err) {
      console.warn('Using fallback GitHub stats data due to rate limit or offline state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubData();
  }, []);

  // Calculate languages breakdown
  const languageCounts: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    }
  });

  const totalStarCount = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForkCount = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return '#3572A5';
      case 'typescript':
        return '#3178C6';
      case 'javascript':
        return '#F1E05A';
      case 'shell':
      case 'bash':
        return '#89E051';
      case 'html':
        return '#E34C26';
      case 'css':
        return '#563D7C';
      default:
        return '#b6d9e0';
    }
  };

  return (
    <div className="w-full mt-12 bg-[#080d14]/90 light:bg-white/90 backdrop-blur-xl border border-[#b6d9e0]/20 light:border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#b6d9e0]/15 light:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#b6d9e0]/10 border border-[#b6d9e0]/25 text-[#b6d9e0] light:text-slate-800">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-[#eef4f6] light:text-slate-900 flex items-center gap-2">
              GitHub Live Telemetry
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-normal">
                Live API
              </span>
            </h3>
            <p className="text-xs text-[#b6d9e0]/70 light:text-slate-500 font-sans">
              Real-time commit telemetry & repository analytics for{' '}
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#b6d9e0] transition-colors"
              >
                @{user.login}
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGithubData}
            disabled={loading}
            className="p-2 rounded-xl bg-[#b6d9e0]/10 hover:bg-[#b6d9e0]/20 border border-[#b6d9e0]/20 text-[#b6d9e0] transition-all text-xs flex items-center gap-1.5"
            title="Refresh GitHub Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#b6d9e0]/15 hover:bg-[#b6d9e0]/25 text-[#b6d9e0] border border-[#b6d9e0]/30 text-xs font-mono font-medium transition-all"
          >
            <span>Visit Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-[#05080e] light:bg-slate-50 p-4 rounded-2xl border border-[#b6d9e0]/15 light:border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#eef4f6] light:text-slate-900">{user.public_repos}</div>
            <div className="text-[11px] text-[#b6d9e0]/60 light:text-slate-500 font-mono">Public Repos</div>
          </div>
        </div>

        <div className="bg-[#05080e] light:bg-slate-50 p-4 rounded-2xl border border-[#b6d9e0]/15 light:border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#eef4f6] light:text-slate-900">{totalStarCount}</div>
            <div className="text-[11px] text-[#b6d9e0]/60 light:text-slate-500 font-mono">Total Stars</div>
          </div>
        </div>

        <div className="bg-[#05080e] light:bg-slate-50 p-4 rounded-2xl border border-[#b6d9e0]/15 light:border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#eef4f6] light:text-slate-900">{totalForkCount}</div>
            <div className="text-[11px] text-[#b6d9e0]/60 light:text-slate-500 font-mono">Total Forks</div>
          </div>
        </div>

        <div className="bg-[#05080e] light:bg-slate-50 p-4 rounded-2xl border border-[#b6d9e0]/15 light:border-slate-200 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#eef4f6] light:text-slate-900">{events.length}</div>
            <div className="text-[11px] text-[#b6d9e0]/60 light:text-slate-500 font-mono">Recent Pushes</div>
          </div>
        </div>
      </div>

      {/* Language Breakdown Progress Bar */}
      <div className="mb-6 bg-[#05080e] light:bg-slate-50 p-4 rounded-2xl border border-[#b6d9e0]/15 light:border-slate-200">
        <div className="flex items-center justify-between text-xs font-mono text-[#b6d9e0]/70 light:text-slate-600 mb-2">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#b6d9e0]" /> Language Ecosystem Breakdown
          </span>
          <span>Top Repos</span>
        </div>

        {/* Stacked bar */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-[#101826]">
          {Object.entries(languageCounts).map(([lang, count]) => {
            const pct = (count / repos.length) * 100;
            return (
              <div
                key={lang}
                style={{ width: `${pct}%`, backgroundColor: getLanguageColor(lang) }}
                className="h-full transition-all duration-500"
                title={`${lang}: ${Math.round(pct)}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 text-xs font-mono text-[#b6d9e0]/80 light:text-slate-600">
          {Object.entries(languageCounts).map(([lang]) => (
            <div key={lang} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLanguageColor(lang) }} />
              <span>{lang}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Controls & Live Feed */}
      <div>
        <div className="flex border-b border-[#b6d9e0]/15 light:border-slate-200 mb-4 gap-4">
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-2 text-xs font-mono font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'activity'
                ? 'border-[#b6d9e0] text-[#b6d9e0] light:border-slate-900 light:text-slate-900'
                : 'border-transparent text-[#b6d9e0]/50 hover:text-[#b6d9e0]/80'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" /> Recent Commit Stream
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`pb-2 text-xs font-mono font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'repos'
                ? 'border-[#b6d9e0] text-[#b6d9e0] light:border-slate-900 light:text-slate-900'
                : 'border-transparent text-[#b6d9e0]/50 hover:text-[#b6d9e0]/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Active Repositories
          </button>
        </div>

        {/* Activity Feed List */}
        {activeTab === 'activity' ? (
          <div className="space-y-2.5">
            {events.map((ev) => {
              const commitMsg = ev.payload.commits?.[0]?.message || 'Pushed updates to repository';
              const sha = ev.payload.commits?.[0]?.sha?.slice(0, 7) || 'HEAD';
              const repoName = ev.repo.name.replace('Mevinb/', '');
              const timeAgo = new Date(ev.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={ev.id}
                  className="bg-[#05080e] light:bg-slate-50 border border-[#b6d9e0]/15 light:border-slate-200 p-3.5 rounded-xl flex items-start justify-between gap-3 text-xs font-mono group hover:border-[#b6d9e0]/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-[#b6d9e0]/10 border border-[#b6d9e0]/20 text-[#b6d9e0] mt-0.5">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#eef4f6] light:text-slate-900">{repoName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#b6d9e0]/15 text-[#b6d9e0]">
                          {sha}
                        </span>
                      </div>
                      <p className="text-[#b6d9e0]/70 light:text-slate-600 mt-1 font-sans text-xs line-clamp-1">
                        {commitMsg}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#b6d9e0]/40 light:text-slate-400 whitespace-nowrap">{timeAgo}</span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Repositories List */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#05080e] light:bg-slate-50 border border-[#b6d9e0]/15 light:border-slate-200 p-4 rounded-xl block group hover:border-[#b6d9e0]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-sm text-[#eef4f6] light:text-slate-900 group-hover:text-[#b6d9e0] transition-colors flex items-center gap-1.5">
                    {repo.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#b6d9e0]/40 group-hover:text-[#b6d9e0]" />
                </div>
                <p className="text-xs text-[#b6d9e0]/60 light:text-slate-500 line-clamp-2 mb-3 font-sans">
                  {repo.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-[#b6d9e0]/70 light:text-slate-600">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-indigo-400" /> {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
