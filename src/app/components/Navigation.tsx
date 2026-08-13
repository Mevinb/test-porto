import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BrandMark } from './BrandMark';

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
      window.history.replaceState(null, '', `#${id}`);
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
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-4 pointer-events-none"
        >
          <div
            className={`w-full max-w-5xl flex items-center justify-between transition-all duration-500 pointer-events-auto ${
              isScrolled
                ? 'bg-[#5E5252]/85 light:bg-white/90 backdrop-blur-xl border border-[#90B800]/20 light:border-[#D9CEBB]/90 shadow-[0_0_30px_rgba(144, 184, 0,0.1)] light:shadow-[0_4px_25px_rgba(0,0,0,0.06)] rounded-full px-4 sm:px-6 py-2 sm:py-2.5'
                : 'bg-transparent px-3 sm:px-4 py-3 sm:py-4 border border-transparent'
            }`}
          >
            {/* Logo */}
            <motion.a
              href="#main-content"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 text-[#90B800] flex items-center justify-center drop-shadow-[0_0_8px_rgba(144, 184, 0,0.35)] group-hover:rotate-[-3deg] transition-transform shrink-0">
                <BrandMark className="h-full w-full" />
              </div>
              <span className="font-semibold tracking-tight text-xs sm:text-base text-[#FCF2E5] light:text-[#524646] group-hover:text-[#90B800] light:group-hover:text-[#90B800] transition-colors whitespace-nowrap">
                Mevin Benty
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#524646]/60 light:bg-[#F4E9D8]/90 p-1 border border-[#90B800]/15 light:border-[#D9CEBB]/80 rounded-full">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isActive 
                        ? 'text-[#524646] light:text-[#FCF2E5] font-semibold' 
                        : 'text-[#A8A492] light:text-[#8A7B7B] hover:text-[#FCF2E5] light:hover:text-[#524646]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-[#90B800] light:bg-[#90B800] rounded-full -z-10 shadow-[0_0_15px_rgba(144, 184, 0,0.4)] light:shadow-[0_0_15px_rgba(144, 184, 0,0.3)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Right Controls (Theme Toggle + CTA) */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="flex items-center justify-center p-2 rounded-full bg-[#524646]/70 light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#C9BEAA] text-[#90B800] light:text-[#90B800] hover:bg-[#90B800]/15 light:hover:bg-[#EFE3D0] transition-all cursor-pointer shadow-sm"
                whileHover={{ scale: 1.08, rotate: 15 }}
                whileTap={{ scale: 0.92 }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              {/* Desktop CTA */}
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="group relative px-5 py-2 overflow-hidden rounded-full bg-[#5E5252] light:bg-[#524646] border border-[#90B800]/30 light:border-[#7A6B6B] text-xs font-semibold text-[#FCF2E5] light:text-[#FCF2E5] shadow-md cursor-pointer transition-all hover:border-[#90B800] light:hover:border-[#90B800] hover:shadow-[0_0_20px_rgba(144, 184, 0,0.25)]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow shining background */}
                <div className="absolute inset-0 w-full h-full bg-[#90B800]/10 light:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Let's Connect
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#90B800] light:bg-[#A8A492] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#90B800] light:bg-[#A8A492]"></span>
                  </span>
                </span>
              </motion.button>
            </div>

            {/* Mobile Controls (Theme Toggle + Menu Toggle) */}
            <div className="md:hidden flex items-center gap-2">
              <motion.button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="flex items-center justify-center p-2 rounded-full text-[#90B800] light:text-[#90B800] bg-[#524646]/60 light:bg-[#F4E9D8] border border-[#90B800]/20 light:border-[#C9BEAA] transition-colors cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                className="flex items-center justify-center p-2 rounded-full text-[#A8A492] light:text-[#524646] hover:text-[#FCF2E5] light:hover:text-black hover:bg-[#6B5D5D] light:hover:bg-[#F4E9D8] transition-colors cursor-pointer"
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
                className="absolute top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-[#5E5252]/95 light:bg-white/95 backdrop-blur-2xl border border-[#90B800]/20 light:border-[#D9CEBB] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4 pointer-events-auto md:hidden max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between text-[#A8A492] light:text-[#A8A492] text-[11px] font-semibold uppercase tracking-wider mb-1">
                  <span>Navigation</span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 text-xs text-[#90B800] light:text-[#90B800] font-semibold cursor-pointer"
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
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center justify-between text-left py-2.5 px-3.5 rounded-xl hover:bg-[#6B5D5D] light:hover:bg-[#F4E9D8] text-[#FCF2E5] light:text-[#524646] transition-all text-sm font-medium cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[#90B800] light:text-[#90B800]">→</span>
                  </a>
                ))}
                <div className="border-t border-[#90B800]/15 light:border-[#D9CEBB] my-1 pt-3">
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className="w-full py-3 bg-[#90B800] light:bg-[#90B800] text-[#524646] light:text-[#FCF2E5] font-bold rounded-xl text-center text-sm shadow-lg shadow-[#90B800]/20 light:shadow-[#90B800]/20 cursor-pointer"
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
