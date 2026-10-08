import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { PrivateLayout } from '../components/layout/PrivateLayout.jsx';
import { PrivateRoute } from './PrivateRoute.jsx';
import { PublicHome } from '../pages/public/PublicHome.jsx';
import { InteractiveGallery, InteractiveMapPage } from '../pages/public/InteractivePublicPages.jsx';
import { ProjectPage } from '../pages/public/ProjectPage.jsx';
import { LoginPage } from '../pages/public/LoginPage.jsx';
import { NewsPage } from '../pages/public/NewsPage.jsx';
import { CoreDashboard } from '../pages/private/CoreDashboard.jsx';
import { ObservationsPage } from '../pages/private/ObservationsPage.jsx';
import { AdminUsersPage } from '../pages/private/AdminUsersPage.jsx';
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function RouteScrollManager() {
  const { pathname, search, hash } = useLocation();
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window.history.scrollRestoration = 'manual';
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search, hash]);
  return null;
}

export function AppRoutes() {
  return (
  <>
  <RouteScrollManager />
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<PublicHome />} />
      <Route path="/proyecto" element={<ProjectPage />} />
      <Route path="/mapa" element={<InteractiveMapPage />} />
      <Route path="/galeria" element={<InteractiveGallery />} />
      <Route path="/noticias" element={<NewsPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<CoreDashboard />} />
        <Route path="/observaciones" element={<ObservationsPage />} />
        <Route path="/admin/usuarios" element={<AdminUsersPage />} />
      </Route>
    </Route>
  </Routes>
  </>
);
}
