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
    <div className="min-h-screen bg-transparent text-[#eef4f6] font-sans antialiased selection:bg-[#b6d9e0]/30 selection:text-[#b6d9e0] relative cursor-default">
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
  );
}
