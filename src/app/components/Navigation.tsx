import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Events' },
  { id: 'contact', label: 'Contact' },
];

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scrolled state
      setIsScrolled(currentScrollY > 50);

      // Show/Hide navigation based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);

      // Scroll Spy logic
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = currentScrollY + window.innerHeight / 3;

      let currentActive = '';
      for (const section of sections) {
        if (!section) continue;
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentActive = section.id;
          break;
        }
      }
      
      // Default to top if scrolled to the very top
      if (currentScrollY < 100) {
        currentActive = '';
      }
      
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-4 pointer-events-none"
        >
          <div
            className={`w-full max-w-5xl flex items-center justify-between transition-all duration-500 pointer-events-auto ${
              isScrolled
                ? 'bg-[#0d1218]/85 light:bg-white/90 backdrop-blur-xl border border-[#b6d9e0]/20 light:border-slate-200/90 shadow-[0_0_30px_rgba(182,217,224,0.1)] light:shadow-[0_4px_25px_rgba(0,0,0,0.06)] rounded-full px-4 sm:px-6 py-2 sm:py-2.5'
                : 'bg-transparent px-3 sm:px-4 py-3 sm:py-4 border border-transparent'
            }`}
          >
            {/* Logo */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#b6d9e0] light:bg-[#0284c7] text-[#080c10] light:text-white flex items-center justify-center font-bold shadow-lg shadow-[#b6d9e0]/25 light:shadow-[#0284c7]/25 group-hover:shadow-[#b6d9e0]/40 transition-all shrink-0">
                <Terminal size={15} className="sm:w-[16px] sm:h-[16px]" />
              </div>
              <span className="font-semibold tracking-tight text-xs sm:text-base text-[#eef4f6] light:text-[#0f172a] group-hover:text-[#b6d9e0] light:group-hover:text-[#0284c7] transition-colors whitespace-nowrap">
                Mevin Benty
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#080c10]/60 light:bg-slate-100/90 p-1 border border-[#b6d9e0]/15 light:border-slate-200/80 rounded-full">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? 'text-[#080c10] light:text-white font-semibold' 
                        : 'text-[#8ea4b0] light:text-slate-600 hover:text-[#eef4f6] light:hover:text-[#0f172a]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-[#b6d9e0] light:bg-[#0284c7] rounded-full -z-10 shadow-[0_0_15px_rgba(182,217,224,0.4)] light:shadow-[0_0_15px_rgba(2,132,199,0.3)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right Controls (Theme Toggle + CTA) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="flex items-center justify-center p-2 rounded-full bg-[#080c10]/70 light:bg-slate-100 border border-[#b6d9e0]/20 light:border-slate-300 text-[#b6d9e0] light:text-[#0284c7] hover:bg-[#b6d9e0]/15 light:hover:bg-slate-200 transition-all cursor-pointer shadow-sm"
                whileHover={{ scale: 1.08, rotate: 15 }}
                whileTap={{ scale: 0.92 }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              {/* Desktop CTA */}
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="group relative px-5 py-2 overflow-hidden rounded-full bg-[#0d1218] light:bg-slate-900 border border-[#b6d9e0]/30 light:border-slate-700 text-xs font-semibold text-[#eef4f6] light:text-white shadow-md cursor-pointer transition-all hover:border-[#b6d9e0] light:hover:border-[#0284c7] hover:shadow-[0_0_20px_rgba(182,217,224,0.25)]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow shining background */}
                <div className="absolute inset-0 w-full h-full bg-[#b6d9e0]/10 light:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Let's Connect
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b6d9e0] light:bg-[#38bdf8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b6d9e0] light:bg-[#38bdf8]"></span>
                  </span>
                </span>
              </motion.button>
            </div>

            {/* Mobile Controls (Theme Toggle + Menu Toggle) */}
            <div className="md:hidden flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="flex items-center justify-center p-2 rounded-full text-[#b6d9e0] light:text-[#0284c7] bg-[#080c10]/60 light:bg-slate-100 border border-[#b6d9e0]/20 light:border-slate-300 transition-colors cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center p-2 rounded-full text-[#8ea4b0] light:text-slate-700 hover:text-[#eef4f6] light:hover:text-black hover:bg-[#141c24] light:hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-[#0d1218]/95 light:bg-white/95 backdrop-blur-2xl border border-[#b6d9e0]/20 light:border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4 pointer-events-auto md:hidden max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between text-[#8ea4b0] light:text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
                  <span>Navigation</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 text-xs text-[#b6d9e0] light:text-[#0284c7] font-semibold cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun size={14} />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={14} />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center justify-between text-left py-2.5 px-3.5 rounded-xl hover:bg-[#141c24] light:hover:bg-slate-100 text-[#eef4f6] light:text-[#0f172a] transition-all text-sm font-medium cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[#b6d9e0] light:text-[#0284c7]">→</span>
                  </button>
                ))}
                <div className="border-t border-[#b6d9e0]/15 light:border-slate-200 my-1 pt-3">
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className="w-full py-3 bg-[#b6d9e0] light:bg-[#0284c7] text-[#080c10] light:text-white font-bold rounded-xl text-center text-sm shadow-lg shadow-[#b6d9e0]/20 light:shadow-[#0284c7]/20 cursor-pointer"
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Me
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
