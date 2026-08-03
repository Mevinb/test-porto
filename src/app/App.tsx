import { ThemeProvider } from './context/ThemeContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Events } from './components/Events';
import { Footer } from './components/Footer';
import { FluidBackground } from './components/FluidBackground';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-transparent text-[#FCF2E5] dark:text-[#FCF2E5] light:text-[#524646] font-sans antialiased selection:bg-[#EC5B38]/30 selection:text-[#EC5B38] relative cursor-default transition-colors duration-500">
        {/* Interactive Reticle Cursor */}
        <CustomCursor />

        {/* Dynamic Fluid Backdrop */}
        <FluidBackground />
        
        {/* Site Sections */}
        <div className="relative z-10">
          <Navigation />
          <Hero />
          <About />
          <Projects />
          <Events />
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
