import { motion, useReducedMotion } from 'motion/react';

const ITEMS = [
  'Generative imaging',
  'Secure backends',
  'GPU automation',
  'Open-source tooling',
  'Computer vision',
  'Linux systems',
];

export function TechTicker() {
  const tickerItems = [...ITEMS, ...ITEMS];
  const reducedMotion = useReducedMotion();

  return (
    <div className="overflow-hidden border-b border-[var(--line)] bg-[var(--highlight)] py-3 text-[#101216]" aria-label="Technical focus areas">
      <motion.div
        className="flex w-max items-center"
        animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={reducedMotion ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {tickerItems.map((item, index) => (
          <div key={`${item}-${index}`} className="flex shrink-0 items-center">
            <span className="px-7 text-[11px] font-bold uppercase tracking-[0.17em]">{item}</span>
            <span className="h-2 w-2 rotate-45 bg-[var(--signal)]" aria-hidden="true" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
