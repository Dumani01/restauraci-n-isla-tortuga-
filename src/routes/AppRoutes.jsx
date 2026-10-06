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

export function AppRoutes() {
  return (
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
      </Route>
    </Route>
  </Routes>
);
}
