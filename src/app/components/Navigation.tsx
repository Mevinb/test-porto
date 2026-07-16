import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Terminal } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Events' },
  { id: 'contact', label: 'Contact' },
];

export function Navigation() {
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
          className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none"
        >
          <div
            className={`w-full max-w-5xl flex items-center justify-between transition-all duration-500 pointer-events-auto ${
              isScrolled
                ? 'bg-slate-900/60 backdrop-blur-xl border border-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.05)] rounded-full px-6 py-2.5'
                : 'bg-transparent px-4 py-4 border border-transparent'
            }`}
          >
            {/* Logo */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <Terminal size={16} />
              </div>
              <span className="font-semibold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Mevin Benty
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/40 p-1 border border-slate-800/30 rounded-full">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="group relative px-5 py-2 overflow-hidden rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-white shadow-md cursor-pointer transition-all hover:border-indigo-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow shining background */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-1.5">
                  Let's Connect
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-20 left-4 right-4 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 pointer-events-auto md:hidden"
              >
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  Navigation
                </div>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center justify-between text-left py-2 px-4 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition-all text-sm font-medium cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-indigo-500 opacity-0 group-hover:opacity-100">→</span>
                  </button>
                ))}
                <div className="border-t border-slate-800 my-2 pt-4">
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold text-center text-sm shadow-lg shadow-indigo-500/20 cursor-pointer"
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
