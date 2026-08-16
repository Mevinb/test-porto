import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CalendarDays, GitBranch, MapPin } from 'lucide-react';
import { supabase, type Event } from '../../lib/supabase';

const MILESTONES = [
  { year: '2026', title: 'Story Teller multi-agent engine', type: 'Build', text: 'Designed a long-form generation workflow with semantic memory and multiple model backends.', url: 'https://github.com/Mevinb/story-teller-' },
  { year: '2025', title: 'Reactorv4 node suite', type: 'Open source', text: 'Released identity restoration tooling for ComfyUI and Stable Diffusion workflows.', url: 'https://github.com/Mevinb/Reactorv4' },
  { year: '2025', title: 'Reactor Linux matrix', type: 'Infrastructure', text: 'Packaged repeatable CUDA and Python environment setup for headless GPU execution.', url: 'https://github.com/Mevinb/reactor-linux' },
];

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false }).limit(3);
      if (!error) setEvents(data ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <section id="notes" className="scroll-mt-[72px] border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.7fr_1.3fr]">
        <div className="relative overflow-hidden border-b border-[var(--line)] px-5 py-16 md:px-10 lg:border-b-0 lg:border-r lg:py-24">
          <motion.div animate={{ rotate: [0, 8, 0], y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-8 top-10 h-16 w-16 bg-[var(--signal)]" aria-hidden="true" />
          <motion.div animate={{ rotate: [0, -12, 0], x: [0, -5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-24 top-26 h-10 w-10 bg-[var(--highlight)]" aria-hidden="true" />
          <motion.p initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="label-mono text-[var(--accent)]">Field notes</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-5 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-6xl">A record of what shipped and what changed.</motion.h2>
          <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }} className="mt-7 max-w-md leading-relaxed text-[var(--ink-soft)]">Selected releases, infrastructure work, and public activities. The emphasis is on progression, not a manufactured activity feed.</motion.p>
        </div>
        <div>
          {MILESTONES.map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} whileHover={{ x: -7 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} className="group grid gap-5 border-b border-[var(--line)] bg-[var(--card)] p-6 transition-colors hover:bg-[var(--project-wash)] md:grid-cols-[90px_1fr_auto] md:items-start md:p-8">
              <div><span className={`font-mono text-xl font-semibold ${index === 1 ? 'text-[var(--signal)]' : index === 2 ? 'text-[#b99a00] dark:text-[var(--highlight)]' : 'text-[var(--accent)]'}`}>{item.year}</span><span className="label-mono mt-1 block text-[var(--ink-faint)]">Note 0{index + 1}</span></div>
              <div><div className="label-mono mb-3 flex items-center gap-2 text-[var(--ink-faint)]"><GitBranch size={13} /> {item.type}</div><h3 className="text-xl font-semibold tracking-[-0.03em]">{item.title}</h3><p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">{item.text}</p></div>
              <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className="text-[var(--accent)]"><ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
            </motion.article>
          ))}
          {(loading || events.length > 0) && <div className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between"><h3 className="text-lg font-semibold">Recent public activity</h3><span className="label-mono text-[var(--ink-faint)]">Supabase feed</span></div>
            {loading ? <div className="h-20 animate-pulse border border-[var(--line)] bg-[var(--paper-strong)]" /> : <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">{events.map((event) => <article key={event.id} className="bg-[var(--card)] p-5"><span className="label-mono text-[var(--accent)]">{event.role}</span><h4 className="mt-4 font-semibold">{event.title}</h4><div className="mt-5 space-y-2 text-xs text-[var(--ink-faint)]"><span className="flex items-center gap-2"><CalendarDays size={13} />{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>{event.location && <span className="flex items-center gap-2"><MapPin size={13} />{event.location}</span>}</div></article>)}</div>}
          </div>}
        </div>
      </div>
    </section>
  );
}
