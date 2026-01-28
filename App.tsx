import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import Services from './pages/Services';
import { ProjectsPage } from './pages/Projects';
import { NewsPage } from './pages/News';
import { ContactPage } from "./pages/Contact";
import { SmoothScroll } from './components/SmoothScroll';
import RealisationsPage from "./pages/Realisations";// App.tsx
import { CaseStudyPage } from "./pages/CaseStudy";
import { Politique } from "./pages/Politique";




const App: React.FC = () => {
  return (
    <HashRouter>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="prestation-services" element={<Services />} />
            <Route path="realisations" element={<RealisationsPage />} />
<Route path="politique" element={<Politique />} />
            <Route path="projets" element={<ProjectsPage />} />
            <Route path="projets/:slug" element={<CaseStudyPage />} />
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