import { useEffect, useMemo, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  CalendarDays,
  FileCheck2,
  MapPin,
} from 'lucide-react';
import { ThemeProvider } from '../context/ThemeContext';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { supabase, type Event } from '../../lib/supabase';

function formatEventDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const year = event.event_date.slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.58, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="group grid border-b border-[var(--line)] bg-[var(--card)] transition-colors hover:bg-[var(--project-wash)] md:grid-cols-[112px_220px_1fr]"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] p-5 md:block md:border-b-0 md:border-r md:p-6">
        <span className="font-mono text-2xl font-semibold text-[var(--accent)]">{year}</span>
        <span className="label-mono mt-2 block text-[var(--ink-faint)]">Record {String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="border-b border-[var(--line)] bg-[var(--paper-strong)] p-4 md:border-b-0 md:border-r">
        {event.image_url ? (
          <a
            href={event.certificate_url || event.image_url}
            target="_blank"
            rel="noreferrer"
            className="block h-full min-h-44 overflow-hidden border border-[var(--line)] bg-white"
            aria-label={`Open ${event.title}`}
          >
            <img
              src={event.image_url}
              alt={`${event.title} certificate preview`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            />
          </a>
        ) : (
          <div className="grid h-full min-h-44 place-items-center border border-dashed border-[var(--line-strong)] bg-[var(--card)]">
            <Award size={28} className="text-[var(--ink-faint)]" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-between p-5 md:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-mono text-[var(--signal)]">{event.role}</span>
            {event.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="border border-[var(--line)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="mt-5 max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.04em] transition-colors group-hover:text-[var(--accent)] md:text-3xl">
            {event.title}
          </h2>
          {event.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">{event.description}</p>
          )}
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2 text-xs text-[var(--ink-faint)]">
            <span className="flex items-center gap-2"><CalendarDays size={13} /> {formatEventDate(event.event_date)}</span>
            {event.location && <span className="flex items-center gap-2"><MapPin size={13} /> {event.location}</span>}
          </div>
          {event.certificate_url ? (
            <a
              href={event.certificate_url}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex w-fit items-center gap-2 bg-[var(--accent)] px-4 py-3 text-xs font-semibold text-[var(--accent-ink)]"
            >
              View certificate
              <ArrowUpRight size={14} className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </a>
          ) : (
            <span className="label-mono inline-flex w-fit items-center gap-2 text-[var(--ink-faint)]"><FileCheck2 size={13} /> Record verified</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function EventsArchive() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      const { data, error: loadError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (loadError) setError('The event archive could not be loaded.');
      else setEvents(data ?? []);
      setLoading(false);
    };
    void load();
  }, []);

  const certificateCount = useMemo(
    () => events.filter((event) => Boolean(event.certificate_url)).length,
    [events],
  );

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="hero-copy mx-auto grid max-w-[1440px] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b border-[var(--line)] px-5 py-16 md:px-10 md:py-24 lg:border-b-0 lg:border-r">
            <motion.a
              href="/#notes"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="label-mono inline-flex items-center gap-2 text-[var(--ink-faint)] hover:text-[var(--accent)]"
            >
              <ArrowLeft size={13} /> Back to field notes
            </motion.a>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="label-mono mt-12 text-[var(--accent)]">
              Events / public record
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] md:text-7xl lg:text-8xl"
            >
              Work beyond the repository.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-8 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              Conferences, workshops, certifications, and community work—documented as a chronological verification ledger.
            </motion.p>
          </div>

          <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-[var(--accent)] p-6 text-[var(--accent-ink)] md:p-10 lg:min-h-0">
            <motion.div
              initial={{ rotate: -8, y: 50, opacity: 0 }}
              animate={{ rotate: -5, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-[-7%] top-[14%] h-48 w-64 border-2 border-white/70 bg-white/10 shadow-[18px_18px_0_rgba(246,217,74,0.95)] md:h-60 md:w-80"
              aria-hidden="true"
            >
              <div className="m-5 h-3 w-20 bg-white/70" />
              <div className="mx-5 mt-12 h-px bg-white/55" />
              <div className="mx-5 mt-4 h-px w-2/3 bg-white/35" />
              <Award className="absolute bottom-5 right-5 text-[var(--highlight)]" size={42} />
            </motion.div>
            <span className="label-mono relative z-10 text-white/70">Archive status</span>
            <div className="relative z-10 grid grid-cols-2 gap-px border border-white/35 bg-white/35">
              <div className="bg-[var(--accent)] p-5"><span className="block font-mono text-4xl font-semibold">{loading ? '—' : events.length}</span><span className="label-mono mt-2 block text-white/65">Event records</span></div>
              <div className="bg-[var(--accent)] p-5"><span className="block font-mono text-4xl font-semibold">{loading ? '—' : certificateCount}</span><span className="label-mono mt-2 block text-white/65">Certificates</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)]">
        <div className="mx-auto max-w-[1440px] border-x border-[var(--line)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] bg-[var(--paper-strong)] px-5 py-7 sm:flex-row sm:items-center md:px-8">
            <div><p className="label-mono text-[var(--accent)]">Chronological ledger</p><p className="mt-2 text-sm text-[var(--ink-soft)]">Newest activity first. Certificates open from Supabase storage.</p></div>
            <span className="label-mono text-[var(--ink-faint)]">{loading ? 'Syncing records' : `${events.length} total entries`}</span>
          </div>

          {loading && (
            <div className="space-y-px bg-[var(--line)]">
              {[0, 1, 2].map((item) => <div key={item} className="h-64 animate-pulse bg-[var(--card)]" />)}
            </div>
          )}
          {!loading && error && <div className="p-10 text-sm text-[var(--signal)]">{error}</div>}
          {!loading && !error && events.length === 0 && <div className="p-10 text-sm text-[var(--ink-soft)]">No event records have been published yet.</div>}
          {!loading && !error && events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
        </div>
      </section>
    </main>
  );
}

export default function EventsPage() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="site-shell min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-300">
          <Navigation />
          <EventsArchive />
          <Footer />
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
