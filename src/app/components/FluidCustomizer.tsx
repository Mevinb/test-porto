import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Sparkles, RotateCcw, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface FluidCustomizerOptions {
  themePreset: 'quantum' | 'emerald' | 'cyberpunk' | 'solar' | 'monochrome';
  particleDensity: 'low' | 'medium' | 'high';
  speedMultiplier: number;
  showConstellations: boolean;
}

interface FluidCustomizerProps {
  options: FluidCustomizerOptions;
  onChange: (newOptions: FluidCustomizerOptions) => void;
  onReset: () => void;
}

export function FluidCustomizer({ options, onChange, onReset }: FluidCustomizerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isLight = theme === 'light';

  const presets: { id: FluidCustomizerOptions['themePreset']; label: string; color: string }[] = [
    { id: 'quantum', label: 'Cyan Quantum', color: '#EC5B38' },
    { id: 'emerald', label: 'Emerald Matrix', color: '#A8A492' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', color: '#EC5B38' },
    { id: 'solar', label: 'Solar Amber', color: '#EC5B38' },
    { id: 'monochrome', label: 'Monochrome', color: '#A8A492' },
  ];

  return (
    <div className="relative font-mono select-none">
      {/* Floating HUD Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#453B3B]/90 light:bg-white/90 backdrop-blur-xl border border-[#EC5B38]/40 light:border-[#C9BEAA] text-[#EC5B38] light:text-[#524646] shadow-2xl hover:border-[#EC5B38] transition-all text-xs font-semibold group cursor-pointer pointer-events-auto"
      >
        <Sliders className="w-4 h-4 text-[#EC5B38] group-hover:rotate-45 transition-transform duration-300" />
        <span>SHADER CONTROL</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Control Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 left-0 w-72 bg-[#453B3B]/95 light:bg-white/95 backdrop-blur-2xl border border-[#EC5B38]/40 light:border-[#C9BEAA] rounded-3xl p-5 shadow-2xl text-xs pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EC5B38]/15 light:border-[#D9CEBB]">
              <span className="font-bold text-[#FCF2E5] light:text-[#524646] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EC5B38]" /> Canvas Dynamics
              </span>
              <button
                onClick={onReset}
                className="text-[10px] text-[#EC5B38]/60 hover:text-[#EC5B38] flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* 1. Theme Color Presets */}
            <div className="my-4">
              <label className="text-[11px] text-[#EC5B38]/70 light:text-[#8A7B7B] block mb-2 font-semibold">
                Color Palette Preset
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onChange({ ...options, themePreset: p.id })}
                    title={p.label}
                    className={`h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      options.themePreset === p.id
                        ? 'border-[#FCF2E5] scale-110 shadow-md ring-2 ring-[#EC5B38]'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </div>
            </div>

            {/* 2. Particle Density */}
            <div className="my-4">
              <label className="text-[11px] text-[#EC5B38]/70 light:text-[#8A7B7B] block mb-2 font-semibold">
                Particle Node Density
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'medium', 'high'] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => onChange({ ...options, particleDensity: density })}
                    className={`py-1.5 rounded-xl border text-[10px] uppercase font-semibold transition-all cursor-pointer ${
                      options.particleDensity === density
                        ? 'bg-[#EC5B38] text-[#3F3636] border-[#EC5B38]'
                        : 'bg-[#3D3535] light:bg-[#F4E9D8] text-[#EC5B38]/70 light:text-[#524646] border-[#EC5B38]/15 hover:border-[#EC5B38]/40'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Animation Speed Multiplier */}
            <div className="my-4">
              <label className="text-[11px] text-[#EC5B38]/70 light:text-[#8A7B7B] block mb-2 font-semibold">
                Animation Speed ({options.speedMultiplier}x)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onChange({ ...options, speedMultiplier: spd })}
                    className={`py-1.5 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer ${
                      options.speedMultiplier === spd
                        ? 'bg-[#EC5B38] text-[#3F3636] border-[#EC5B38]'
                        : 'bg-[#3D3535] light:bg-[#F4E9D8] text-[#EC5B38]/70 light:text-[#524646] border-[#EC5B38]/15 hover:border-[#EC5B38]/40'
                    }`}
                  >
                    {spd}x Speed
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Constellation Line Toggle */}
            <div className="mt-4 pt-3 border-t border-[#EC5B38]/15 light:border-[#D9CEBB] flex items-center justify-between">
              <span className="text-[11px] text-[#EC5B38]/70 light:text-[#8A7B7B] font-semibold">
                Constellation Grid Lines
              </span>
              <button
                onClick={() => onChange({ ...options, showConstellations: !options.showConstellations })}
                className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  options.showConstellations
                    ? 'bg-[#EC5B38]/20 border-[#EC5B38]/40 text-[#EC5B38]'
                    : 'bg-[#3D3535] border-[#EC5B38]/15 text-[#EC5B38]/40'
                }`}
              >
                {options.showConstellations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
