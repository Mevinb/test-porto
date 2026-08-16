import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './app/App.tsx';
import './styles/index.css';

const AdminEvents = lazy(() => import('./app/pages/AdminEvents.tsx'));
const EventsPage = lazy(() => import('./app/pages/EventsPage.tsx'));

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--paper)] text-[var(--ink)]">
      <div className="w-48">
        <span className="label-mono text-[var(--accent)]">Loading archive</span>
        <div className="mt-4 h-[3px] overflow-hidden bg-[var(--line)]">
          <div className="h-full w-2/3 animate-pulse bg-[var(--accent)]" />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/admin" element={<AdminEvents />} />
        <Route path="/admin/events" element={<AdminEvents />} />
      </Routes>
    </Suspense>
  </BrowserRouter>,
);
