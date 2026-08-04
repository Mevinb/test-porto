import { motion, useReducedMotion } from 'motion/react';
import { Rocket } from 'lucide-react';

interface RocketSpec {
  id: number;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  direction: 1 | -1;
  drift: number;
  wobble: number;
}

const ROCKETS: RocketSpec[] = [
  { id: 1, top: '8%', size: 24, duration: 16, delay: 0, opacity: 0.85, direction: 1, drift: 30, wobble: 5 },
  { id: 2, top: '20%', size: 15, duration: 23, delay: 4, opacity: 0.55, direction: -1, drift: -20, wobble: -4 },
  { id: 3, top: '36%', size: 20, duration: 19, delay: 9, opacity: 0.7, direction: 1, drift: -26, wobble: 6 },
  { id: 4, top: '50%', size: 13, duration: 27, delay: 1, opacity: 0.5, direction: -1, drift: 18, wobble: -5 },
  { id: 5, top: '66%', size: 22, duration: 14, delay: 6, opacity: 0.8, direction: 1, drift: 22, wobble: 4 },
  { id: 6, top: '80%', size: 16, duration: 24, delay: 12, opacity: 0.6, direction: -1, drift: -16, wobble: -6 },
  { id: 7, top: '91%', size: 18, duration: 17, delay: 3, opacity: 0.65, direction: 1, drift: 14, wobble: 5 },
];

export function Rockets() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {ROCKETS.map((r) => {
        const horizontal = r.direction === 1 ? ['-8vw', '108vw'] : ['8vw', '-108vw'];
        const baseRotation = r.direction === 1 ? 45 : -135;
        const tailClass =
          r.direction === 1
            ? 'absolute right-[calc(100%+4px)] top-1/2 -translate-y-1/2 h-[3px] w-10 bg-gradient-to-l from-[#90B800]/90 via-[#90B800]/40 to-transparent rounded-full'
            : 'absolute left-[calc(100%+4px)] top-1/2 -translate-y-1/2 h-[3px] w-10 bg-gradient-to-r from-[#90B800]/90 via-[#90B800]/40 to-transparent rounded-full';
        const flameClass =
          r.direction === 1
            ? 'absolute right-[calc(100%-1px)] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#A8D500] blur-[1.5px] animate-pulse'
            : 'absolute left-[calc(100%-1px)] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#A8D500] blur-[1.5px] animate-pulse';

        return (
          <motion.div
            key={r.id}
            className="relative flex items-center"
            style={{
              top: r.top,
              left: r.direction === 1 ? 0 : undefined,
              right: r.direction === -1 ? 0 : undefined,
              opacity: r.opacity,
            }}
            initial={{ x: horizontal[0] }}
            animate={{ x: horizontal, y: [0, r.drift, 0] }}
            transition={{
              x: { duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'linear' },
              y: { duration: r.duration, delay: r.delay, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <span className={tailClass} />
            <span className={flameClass} />
            <motion.span
              className="inline-flex"
              animate={{ rotate: [baseRotation, baseRotation + r.wobble, baseRotation] }}
              transition={{
                duration: r.duration,
                delay: r.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Rocket
                size={r.size}
                className="drop-shadow-[0_0_6px_rgba(144, 184, 0,0.55)]"
                style={{ color: '#90B800' }}
                strokeWidth={2}
              />
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
