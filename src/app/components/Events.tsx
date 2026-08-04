import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  MapPin,
  Award,
  Tag,
  ExternalLink,
  Users,
  Trophy,
  Presentation,
  Mic,
} from 'lucide-react';
import { supabase, type Event } from '../../lib/supabase';
import { useTheme } from '../context/ThemeContext';

const ROLE_ICONS: Record<string, React.ReactNode> = {
  Participant: <Users size={14} className="text-[#90B800]" />,
  Speaker: <Mic size={14} className="text-[#A8A492]" />,
  Organizer: <Presentation size={14} className="text-[#90B800]" />,
  Winner: <Trophy size={14} className="text-[#A8A492]" />,
  Volunteer: <Users size={14} className="text-[#90B800]" />,
};

const getRoleIcon = (role: string) =>
  ROLE_ICONS[role] ?? <Users size={14} className="text-[#A8A492]" />;

const getRoleColor = (role: string) => {
  const map: Record<string, string> = {
    Participant: 'text-[#90B800] light:text-[#90B800] border-[#90B800]/30 light:border-[#90B800]/30 bg-[#90B800]/10 light:bg-[#90B800]/10',
    Speaker: 'text-[#A8A492] light:text-[#524646] border-[#A8A492]/30 light:border-[#C9BEAA] bg-[#A8A492]/10 light:bg-[#F4E9D8]',
    Organizer: 'text-[#90B800] light:text-[#90B800] border-[#90B800]/30 light:border-[#90B800]/30 bg-[#90B800]/10 light:bg-[#90B800]/10',
    Winner: 'text-[#A8A492] light:text-[#524646] border-[#A8A492]/30 light:border-[#C9BEAA] bg-[#A8A492]/10 light:bg-[#F4E9D8]',
    Volunteer: 'text-[#90B800] light:text-[#90B800] border-[#90B800]/30 light:border-[#90B800]/30 bg-[#90B800]/10 light:bg-[#90B800]/10',
  };
  return map[role] ?? 'text-[#A8A492] light:text-[#8A7B7B] border-[#90B800]/15 light:border-[#D9CEBB] bg-[#524646]/40 light:bg-[#F4E9D8]';
};

function EventCard({ event, index }: { event: Event; index: number }) {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const isLight = theme === 'light';
  const spotlightColor = isLight ? 'rgba(144, 184, 0, 0.12)' : 'rgba(144, 184, 0, 0.12)';

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden bg-[#5E5252]/80 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/15 light:border-[#D9CEBB]/90 rounded-2xl sm:rounded-3xl flex flex-col hover:bg-[#5E5252] light:hover:bg-white hover:border-[#90B800]/35 light:hover:border-[#C9BEAA] transition-all duration-300 shadow-lg light:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      {/* Spotlight glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Event Image */}
      {event.image_url && (
        <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#524646] light:from-[#524646]/60 via-transparent to-transparent" />
          {/* Role badge over image */}
          <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${getRoleColor(event.role)}`}>
            {getRoleIcon(event.role)}
            {event.role}
          </div>
        </div>
      )}

      <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1">
        {/* Role badge (when no image) */}
        {!event.image_url && (
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold ${getRoleColor(event.role)}`}>
              {getRoleIcon(event.role)}
              {event.role}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#FCF2E5] light:text-[#524646] mb-2 group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors duration-300 leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-[#A8A492] light:text-[#8A7B7B] text-xs leading-relaxed mb-4 flex-1">
            {event.description}
          </p>
        )}

        <div className="mt-auto space-y-3">
          {/* Meta: Date & Location */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#A8A492] light:text-[#A8A492]">
              <Calendar size={12} className="text-[#90B800] light:text-[#90B800] shrink-0" />
              <span>{formattedDate}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#A8A492] light:text-[#A8A492]">
                <MapPin size={12} className="text-[#90B800] light:text-[#90B800] shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              <Tag size={11} className="text-[#A8A492]/60 light:text-[#A8A492] mt-0.5 shrink-0" />
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-[#524646]/60 light:bg-[#F4E9D8] border border-[#90B800]/15 light:border-[#D9CEBB] text-[#A8A492] light:text-[#8A7B7B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Certificate Link */}
          {event.certificate_url && (
            <motion.a
              href={event.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#90B800] light:text-[#90B800] hover:text-[#FCF2E5] light:hover:text-[#789900]"
              whileHover={{ x: 3 }}
            >
              <Award size={13} />
              <span>View Certificate</span>
              <ExternalLink size={11} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Placeholder skeleton for loading state ───────────────────────────────────
function EventCardSkeleton() {
  return (
    <div className="bg-[#5E5252]/40 light:bg-white/60 border border-[#90B800]/15 light:border-[#D9CEBB] rounded-2xl sm:rounded-3xl p-5 sm:p-6 animate-pulse">
      <div className="h-3 bg-[#6B5D5D] light:bg-[#EFE3D0] rounded-full w-16 mb-4" />
      <div className="h-5 bg-[#6B5D5D] light:bg-[#EFE3D0] rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-[#6B5D5D] light:bg-[#EFE3D0] rounded-full w-full mb-1" />
      <div className="h-3 bg-[#6B5D5D] light:bg-[#EFE3D0] rounded-full w-2/3 mb-6" />
      <div className="flex gap-3">
        <div className="h-3 bg-[#6B5D5D] light:bg-[#EFE3D0] rounded-full w-24" />
        <div className="h-3 bg-[#6B5D5D] light:bg-[#EFE3D0] rounded-full w-20" />
      </div>
    </div>
  );
}

export function Events() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        setError('Could not load events.');
      } else {
        setEvents(data ?? []);
      }
      setLoading(false);
    };

    void fetchEvents();
  }, []);

  if (!loading && events.length === 0 && !error) {
    return null; // Hide section if no events yet
  }

  return (
    <section id="events" ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#90B800]/5 light:bg-[#90B800]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div className="max-w-xl text-left">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#90B800] light:text-[#90B800] mb-2 sm:mb-3"
            >
              Experience
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-4xl font-extrabold text-[#FCF2E5] light:text-[#524646] tracking-tight"
            >
              Events & Activities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#A8A492] light:text-[#8A7B7B] text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed"
            >
              Hackathons, conferences, workshops, and community events I've been part of.
            </motion.p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-[#A8A492] text-sm">
            {error}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
