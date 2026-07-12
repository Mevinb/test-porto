import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { FluidBackground } from './components/FluidBackground';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Dynamic Fluid Backdrop */}
      <FluidBackground />
      
      {/* Site Sections */}
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Footer />
    </div>
  );
}
