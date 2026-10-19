import { lazy, Suspense, useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PublicLayout } from "../components/layout/PublicLayout.jsx";
import { PrivateLayout } from "../components/layout/PrivateLayout.jsx";
import { PrivateRoute } from "./PrivateRoute.jsx";
import { useTranslation } from "react-i18next";

const PublicHome = lazy(() =>
  import("../pages/public/PublicHome.jsx").then((module) => ({
    default: module.PublicHome,
  })),
);
const InteractiveGallery = lazy(() =>
  import("../pages/public/InteractivePublicPages.jsx").then((module) => ({
    default: module.InteractiveGallery,
  })),
);
const InteractiveMapPage = lazy(() =>
  import("../pages/public/InteractivePublicPages.jsx").then((module) => ({
    default: module.InteractiveMapPage,
  })),
);
const ProjectPage = lazy(() =>
  import("../pages/public/ProjectPage.jsx").then((module) => ({
    default: module.ProjectPage,
  })),
);
const LoginPage = lazy(() =>
  import("../pages/public/LoginPage.jsx").then((module) => ({
    default: module.LoginPage,
  })),
);
const NewsPage = lazy(() =>
  import("../pages/public/NewsPage.jsx").then((module) => ({
    default: module.NewsPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("../pages/public/NotFoundPage.jsx").then((module) => ({
    default: module.NotFoundPage,
  })),
);
const CoreDashboard = lazy(() =>
  import("../pages/private/CoreDashboard.jsx").then((module) => ({
    default: module.CoreDashboard,
  })),
);
const ObservationsPage = lazy(() =>
  import("../pages/private/ObservationsPage.jsx").then((module) => ({
    default: module.ObservationsPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("../pages/private/AdminUsersPage.jsx").then((module) => ({
    default: module.AdminUsersPage,
  })),
);

function RouteFallback() {
  const { t } = useTranslation();
  return (
    <main className="route-loading" role="status">
      {t("common.loading")}
    </main>
  );
}

function RouteScrollManager() {
  const { pathname, search, hash } = useLocation();
  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    window.history.scrollRestoration = "manual";
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/proyecto" element={<ProjectPage />} />
            <Route path="/mapa" element={<InteractiveMapPage />} />
            <Route path="/galeria" element={<InteractiveGallery />} />
            <Route path="/noticias" element={<NewsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<CoreDashboard />} />
              <Route path="/observaciones" element={<ObservationsPage />} />
              <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
