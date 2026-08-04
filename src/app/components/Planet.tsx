import { motion, useReducedMotion } from 'motion/react';

export function Planet() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      <div className="absolute right-[-58%] sm:right-[-34%] lg:right-[-28%] top-1/2 w-[min(125vw,920px)] aspect-square -translate-y-1/2">
        <motion.div
          className="absolute inset-0 rounded-full opacity-90 light:opacity-75"
          initial={reducedMotion ? false : { x: 55, opacity: 0 }}
          animate={reducedMotion ? undefined : { x: 0, opacity: 0.9 }}
          transition={{ duration: 1.4, delay: 0.35, ease: 'easeOut' }}
        >
          {/* Atmospheric halo */}
          <div className="absolute -inset-7 rounded-full bg-[#90B800]/15 blur-2xl" />

          <div className="absolute inset-0 overflow-hidden rounded-full bg-[#344414] shadow-[inset_-150px_-45px_190px_rgba(5,8,3,0.94),inset_45px_15px_90px_rgba(210,242,108,0.24),0_0_35px_rgba(144,184,0,0.22)]">
            {/* Uneven rocky terrain */}
            <div
              className="absolute inset-0"
              style={{
                background: [
                  'radial-gradient(ellipse at 24% 18%, rgba(190, 218, 94, 0.45) 0 7%, transparent 19%)',
                  'radial-gradient(ellipse at 48% 31%, rgba(81, 110, 33, 0.85) 0 10%, transparent 25%)',
                  'radial-gradient(ellipse at 27% 61%, rgba(111, 139, 46, 0.72) 0 13%, transparent 30%)',
                  'radial-gradient(ellipse at 65% 69%, rgba(35, 55, 20, 0.8) 0 10%, transparent 28%)',
                  'radial-gradient(ellipse at 73% 23%, rgba(137, 164, 55, 0.42) 0 8%, transparent 23%)',
                  'linear-gradient(135deg, #78932f 0%, #536b25 34%, #334619 62%, #172311 100%)',
                ].join(', '),
              }}
            />

            {/* Mountain ridges */}
            <div className="absolute left-[9%] top-[28%] h-[13%] w-[48%] rotate-[-12deg] rounded-[48%] border-t-2 border-[#c6dc76]/20 bg-[#263818]/25 blur-[1px]" />
            <div className="absolute left-[17%] top-[70%] h-[9%] w-[42%] rotate-[15deg] rounded-[50%] border-t border-[#b5cd68]/15 bg-[#1b2c12]/35" />
            <div className="absolute left-[46%] top-[48%] h-[8%] w-[30%] rotate-[-28deg] rounded-[50%] border-t border-[#d0e888]/10 bg-[#243416]/25" />

            {/* Craters with lit rims and deep inset shadows */}
            <div className="absolute left-[20%] top-[30%] h-[11%] w-[11%] rounded-full border border-[#c7dc77]/35 bg-[#263718]/65 shadow-[inset_7px_7px_12px_rgba(8,13,5,0.7),-3px_-3px_7px_rgba(212,236,128,0.2)]" />
            <div className="absolute left-[52%] top-[18%] h-[7%] w-[7%] rounded-full border border-[#c7dc77]/25 bg-[#263718]/70 shadow-[inset_5px_5px_9px_rgba(8,13,5,0.75),-2px_-2px_5px_rgba(212,236,128,0.16)]" />
            <div className="absolute left-[39%] top-[58%] h-[16%] w-[16%] rounded-full border-2 border-[#aec363]/20 bg-[#223315]/65 shadow-[inset_11px_10px_18px_rgba(8,13,5,0.8),-4px_-4px_9px_rgba(212,236,128,0.14)]" />
            <div className="absolute left-[68%] top-[43%] h-[8%] w-[8%] rounded-full border border-[#aabb5e]/20 bg-[#1b2a12]/75 shadow-[inset_6px_6px_10px_rgba(5,9,3,0.8)]" />
            <div className="absolute left-[18%] top-[76%] h-[6%] w-[6%] rounded-full border border-[#aabb5e]/25 bg-[#243517]/70 shadow-[inset_4px_4px_7px_rgba(5,9,3,0.8)]" />

            {/* Fine mineral speckle */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-screen"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(225, 239, 158, 0.65) 0 1px, transparent 1.5px)',
                backgroundSize: '29px 31px',
                backgroundPosition: '7px 11px',
              }}
            />

            {/* Curved day-to-night terminator creates the spherical depth. */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_25%_28%,transparent_0%,transparent_30%,rgba(8,12,6,0.18)_52%,rgba(5,7,4,0.88)_86%,rgba(2,3,2,0.98)_100%)]" />
            <div className="absolute inset-[1.5%] rounded-full border-l border-t border-[#d3e98b]/20" />
          </div>

          <div className="absolute -inset-px rounded-full border border-[#A8D500]/55 shadow-[0_0_22px_rgba(144,184,0,0.45)]" />
        </motion.div>
      </div>

      {/* Side fade blends the cropped planet into the page background. */}
      <div className="absolute inset-y-0 right-0 w-[12%] bg-gradient-to-l from-[#524646]/25 to-transparent light:from-[#FCF2E5]/20" />
    </div>
  );
}
