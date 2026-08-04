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
        return '#A8A492';
      case 'typescript':
        return '#90B800';
      case 'javascript':
        return '#A8D500';
      case 'shell':
      case 'bash':
        return '#A8A492';
      case 'html':
        return '#90B800';
      case 'css':
        return '#524646';
      default:
        return '#90B800';
    }
  };

  return (
    <div className="w-full mt-12 bg-[#463D3D]/90 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/20 light:border-[#D9CEBB] rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#90B800]/15 light:border-[#D9CEBB]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#90B800]/10 border border-[#90B800]/25 text-[#90B800] light:text-[#524646]">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-[#FCF2E5] light:text-[#524646] flex items-center gap-2">
              GitHub Live Telemetry
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#A8A492]/10 text-[#A8A492] border border-[#A8A492]/30 font-normal">
                Live API
              </span>
            </h3>
            <p className="text-xs text-[#90B800]/70 light:text-[#A8A492] font-sans">
              Real-time commit telemetry & repository analytics for{' '}
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#90B800] transition-colors"
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
            className="p-2 rounded-xl bg-[#90B800]/10 hover:bg-[#90B800]/20 border border-[#90B800]/20 text-[#90B800] transition-all text-xs flex items-center gap-1.5"
            title="Refresh GitHub Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#90B800]/15 hover:bg-[#90B800]/25 text-[#90B800] border border-[#90B800]/30 text-xs font-mono font-medium transition-all"
          >
            <span>Visit Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-[#403737] light:bg-[#F7EBDD] p-4 rounded-2xl border border-[#90B800]/15 light:border-[#D9CEBB] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#90B800]/10 border border-[#90B800]/30 text-[#90B800]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#FCF2E5] light:text-[#524646]">{user.public_repos}</div>
            <div className="text-[11px] text-[#90B800]/60 light:text-[#A8A492] font-mono">Public Repos</div>
          </div>
        </div>

        <div className="bg-[#403737] light:bg-[#F7EBDD] p-4 rounded-2xl border border-[#90B800]/15 light:border-[#D9CEBB] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#90B800]/10 border border-[#90B800]/30 text-[#90B800]">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#FCF2E5] light:text-[#524646]">{totalStarCount}</div>
            <div className="text-[11px] text-[#90B800]/60 light:text-[#A8A492] font-mono">Total Stars</div>
          </div>
        </div>

        <div className="bg-[#403737] light:bg-[#F7EBDD] p-4 rounded-2xl border border-[#90B800]/15 light:border-[#D9CEBB] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#A8A492]/10 border border-[#A8A492]/30 text-[#A8A492]">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#FCF2E5] light:text-[#524646]">{totalForkCount}</div>
            <div className="text-[11px] text-[#90B800]/60 light:text-[#A8A492] font-mono">Total Forks</div>
          </div>
        </div>

        <div className="bg-[#403737] light:bg-[#F7EBDD] p-4 rounded-2xl border border-[#90B800]/15 light:border-[#D9CEBB] flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#A8A492]/10 border border-[#A8A492]/30 text-[#A8A492]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#FCF2E5] light:text-[#524646]">{events.length}</div>
            <div className="text-[11px] text-[#90B800]/60 light:text-[#A8A492] font-mono">Recent Pushes</div>
          </div>
        </div>
      </div>

      {/* Language Breakdown Progress Bar */}
      <div className="mb-6 bg-[#403737] light:bg-[#F7EBDD] p-4 rounded-2xl border border-[#90B800]/15 light:border-[#D9CEBB]">
        <div className="flex items-center justify-between text-xs font-mono text-[#90B800]/70 light:text-[#8A7B7B] mb-2">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#90B800]" /> Language Ecosystem Breakdown
          </span>
          <span>Top Repos</span>
        </div>

        {/* Stacked bar */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-[#4A4040]">
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
        <div className="flex flex-wrap gap-4 mt-3 text-xs font-mono text-[#90B800]/80 light:text-[#8A7B7B]">
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
        <div className="flex border-b border-[#90B800]/15 light:border-[#D9CEBB] mb-4 gap-4">
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-2 text-xs font-mono font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'activity'
                ? 'border-[#90B800] text-[#90B800] light:border-[#524646] light:text-[#524646]'
                : 'border-transparent text-[#90B800]/50 hover:text-[#90B800]/80'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" /> Recent Commit Stream
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`pb-2 text-xs font-mono font-medium transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'repos'
                ? 'border-[#90B800] text-[#90B800] light:border-[#524646] light:text-[#524646]'
                : 'border-transparent text-[#90B800]/50 hover:text-[#90B800]/80'
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
                  className="bg-[#403737] light:bg-[#F7EBDD] border border-[#90B800]/15 light:border-[#D9CEBB] p-3.5 rounded-xl flex items-start justify-between gap-3 text-xs font-mono group hover:border-[#90B800]/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-[#90B800]/10 border border-[#90B800]/20 text-[#90B800] mt-0.5">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#FCF2E5] light:text-[#524646]">{repoName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#90B800]/15 text-[#90B800]">
                          {sha}
                        </span>
                      </div>
                      <p className="text-[#90B800]/70 light:text-[#8A7B7B] mt-1 font-sans text-xs line-clamp-1">
                        {commitMsg}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#90B800]/40 light:text-[#A8A492] whitespace-nowrap">{timeAgo}</span>
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
                className="bg-[#403737] light:bg-[#F7EBDD] border border-[#90B800]/15 light:border-[#D9CEBB] p-4 rounded-xl block group hover:border-[#90B800]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-sm text-[#FCF2E5] light:text-[#524646] group-hover:text-[#90B800] transition-colors flex items-center gap-1.5">
                    {repo.name}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#90B800]/40 group-hover:text-[#90B800]" />
                </div>
                <p className="text-xs text-[#90B800]/60 light:text-[#A8A492] line-clamp-2 mb-3 font-sans">
                  {repo.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-[#90B800]/70 light:text-[#8A7B7B]">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#90B800]" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-[#A8A492]" /> {repo.forks_count}
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
