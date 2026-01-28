import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import Services from './pages/Services';
import { ProjectsPage } from './pages/Projects';
import { NewsPage } from './pages/News';
import { ContactPage } from "./pages/Contact";
import { SmoothScroll } from './components/SmoothScroll';
import { Politique } from "./pages/Politique";

// Lazy-load heavy routes to reduce initial JS bundle
const RealisationsPage = lazy(() => import("./pages/Realisations"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudy").then(m => ({ default: m.CaseStudyPage })));

// Loading fallback for lazy routes
const LazyFallback = () => <div className="h-screen flex items-center justify-center text-white">Chargement...</div>;

const App: React.FC = () => {
  return (
    <HashRouter>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="prestation-services" element={<Services />} />
            <Route 
              path="realisations" 
              element={
                <Suspense fallback={<LazyFallback />}>
                  <RealisationsPage />
                </Suspense>
              } 
            />
            <Route path="politique" element={<Politique />} />
            <Route path="projets" element={<ProjectsPage />} />
            <Route 
              path="projets/:slug" 
              element={
                <Suspense fallback={<LazyFallback />}>
                  <CaseStudyPage />
                </Suspense>
              } 
            />
            <Route path="news" element={<NewsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<div className="h-screen flex items-center justify-center text-white">404 - Not Found</div>} />
          </Route>
        </Routes>
      </SmoothScroll>
    </HashRouter>
  );
};

export default App;