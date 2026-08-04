import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BrandMark } from './BrandMark';

const INTRO_SEEN_KEY = 'portfolio_intro_seen';

export function SiteIntro() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(
    () => !reducedMotion && sessionStorage.getItem(INTRO_SEEN_KEY) !== '1',
  );

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = 'hidden';
    const timeout = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1');
      setVisible(false);
      document.body.style.overflow = '';
    }, 1450);

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.55 }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-[#473D3D] light:bg-[#FCF2E5]"
            exit={{ x: '-102%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[#473D3D] light:bg-[#FCF2E5]"
            exit={{ x: '102%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 text-[#FCF2E5] light:text-[#524646]">
              <div className="flex h-14 w-14 items-center justify-center text-[#90B800] drop-shadow-[0_0_14px_rgba(144, 184, 0,0.4)]">
                <BrandMark className="h-full w-full" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-wide">MEVIN BENTY</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#A8A492]">
                  Portfolio / 2026
                </div>
              </div>
            </div>

            <div className="mt-5 h-px w-40 overflow-hidden bg-[#A8A492]/20">
              <motion.div
                className="h-full origin-left bg-[#90B800]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.85, delay: 0.18, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
