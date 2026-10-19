import { useState } from "react";
import {
  Activity,
  Bell,
  Camera,
  ChevronDown,
  ClipboardList,
  Map,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UserPlus,
  Users,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/auth/AuthProvider.jsx";
import { useTheme } from "../../components/theme/ThemeProvider.jsx";
import { CoralRegistry } from "../../components/dashboard/CoralRegistry.jsx";
import {
  getMapPointRecords,
  getObservationRecords,
  getUserRecords,
} from "../../services/databaseService.js";
import { lifecycleStages } from "../../services/projectData.js";

function DashboardShell({ role, title, eyebrow, children }) {
  const { t } = useTranslation();
  const { isDark: darkTheme, toggleTheme } = useTheme();
  return (
    <section
      className={`core-dashboard core-dashboard--${role.toLowerCase()}${darkTheme ? " core-dashboard--dark" : ""}`}
    >
      <header className="core-dashboard__topbar">
        <span className="core-icon-button" aria-hidden="true">
          <Menu size={19} />
        </span>
        <div className="core-search" aria-hidden="true">
          <Search size={16} />
          <span>{t("common.search")}</span>
        </div>
        <div className="core-topbar__actions">
          <span className="core-icon-button" aria-hidden="true">
            <Bell size={18} />
          </span>
          <span className="core-icon-button" aria-hidden="true">
            <Activity size={18} />
          </span>
          <button
            className="core-icon-button core-theme-toggle"
            type="button"
            aria-label={
              darkTheme ? t("common.lightTheme") : t("common.darkTheme")
            }
            aria-pressed={darkTheme}
            onClick={toggleTheme}
          >
            {darkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <div className="core-dashboard__body">
        <nav className="core-breadcrumb" aria-label={t("common.breadcrumb")}>
          <Link to="/dashboard">{t("common.home")}</Link>
          <span>/</span>
          <strong>{title}</strong>
        </nav>
        <div className="core-dashboard__heading">
          <div>
            <p className="eyebrow">
              <Waves size={14} /> {eyebrow}
            </p>
            <h1>{title}</h1>
          </div>
          <span className="core-demo-pill">{t("common.demo")}</span>
        </div>
        {children}
        <CoralRegistry />
      </div>
    </section>
  );
}

function RoleWidgets({ widgets }) {
  return (
    <div className="core-widgets">
      {widgets.map(({ icon: Icon, label, value, note }) => (
        <article className="core-widget core-widget--coral" key={label}>
          <div className="core-widget__top">
            <Icon size={20} />
          </div>
          <p>{label}</p>
          <strong>{value}</strong>
          <small>{note}</small>
        </article>
      ))}
    </div>
  );
}

function useObservationCount(t) {
  const [result] = useState(() => {
    try {
      return { count: getObservationRecords().length, error: "" };
    } catch (error) {
      return {
        count: null,
        error: error.message || "OBSERVATION_STORAGE_READ_FAILED",
      };
    }
  });
  return {
    value: result.count ?? "—",
    note: result.error
      ? t(`private.observationErrors.${result.error}`, {
          defaultValue: t(
            "private.observationStorageError",
            "No se pudieron leer los registros guardados.",
          ),
        })
      : t("private.pendingValidation", "Pendientes de revisión"),
  };
}

function AdminDashboard() {
  const { t } = useTranslation();
  const users = getUserRecords();
  const observations = useObservationCount(t);
  const mapPoints = getMapPointRecords();
  const activities = t("content.howWeWork", { returnObjects: true });
  return (
    <DashboardShell
      role="admin"
      title={t("private.adminDashboard", "Panel de administración")}
      eyebrow={t("private.adminArea", "Administración del proyecto")}
    >
      <RoleWidgets
        widgets={[
          {
            icon: Users,
            label: t("private.registeredUsers", "Usuarios registrados"),
            value: users.length,
            note: t("common.demo", "Datos demo"),
          },
          {
            icon: ClipboardList,
            label: t("private.observationsCount", "Observaciones"),
            value: observations.value,
            note: observations.note,
          },
          {
            icon: ShieldCheck,
            label: t("private.demoProfiles", "Perfiles demo"),
            value: users.filter((user) => user.demo).length,
            note: t("private.availableProfiles", "Disponibles para probar"),
          },
          {
            icon: Map,
            label: t("private.referencePoints", "Puntos de referencia"),
            value: mapPoints.length,
            note: t("common.demo", "Datos demo"),
          },
        ]}
      />
      <div className="core-role-grid">
        <section className="core-card core-role-panel">
          <div className="core-card__header">
            <div>
              <h2>{t("private.userManagement", "Gestión de usuarios")}</h2>
              <p>
                {t(
                  "private.registerUserIntro",
                  "Crea accesos demo para revisar los distintos perfiles del sistema.",
                )}
              </p>
            </div>
            <UserPlus size={20} />
          </div>
          <Link className="core-card__link" to="/admin/usuarios">
            {t("private.registerUser", "Registrar usuario")}{" "}
            <ChevronDown size={15} />
          </Link>
        </section>
        <section className="core-card core-context">
          <div className="core-card__header">
            <div>
              <h2>{t("private.projectInfo")}</h2>
              <p>{t("private.processDescription")}</p>
            </div>
          </div>
          <p>{t("content.locationDescription")}</p>
          <div className="core-context__item">
            <span>{t("private.location")}</span>
            <strong>{t("content.location")}</strong>
          </div>
          <div className="core-context__item">
            <span>{t("private.principle")}</span>
            <strong>{t("private.collaborative")}</strong>
          </div>
        </section>
      </div>
      <section className="core-card core-traffic">
        <div className="core-card__header">
          <div>
            <h2>{t("private.processTitle")}</h2>
            <p>{t("private.processDescription")}</p>
          </div>
        </div>
        <div className="core-lifecycle-list">
          {activities.map((item, index) => (
            <div className="core-context__item" key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function ModeratorDashboard() {
  const { t } = useTranslation();
  const observations = useObservationCount(t);
  const activities = t("content.howWeWork", { returnObjects: true });
  return (
    <DashboardShell
      role="moderator"
      title={t("private.moderatorDashboard", "Panel de coordinación")}
      eyebrow={t("private.moderatorArea", "Seguimiento del proyecto")}
    >
      <RoleWidgets
        widgets={[
          {
            icon: ClipboardList,
            label: t("private.observationsCount", "Observaciones"),
            value: observations.value,
            note: observations.note,
          },
          {
            icon: Map,
            label: t("private.referencePoints", "Puntos de referencia"),
            value: getMapPointRecords().length,
            note: t("common.demo", "Datos demo"),
          },
          {
            icon: Activity,
            label: t("private.lifecycle"),
            value: lifecycleStages.length,
            note: t("private.lifecycleDescription"),
          },
          {
            icon: Camera,
            label: t("private.workSteps", "Pasos de trabajo"),
            value: activities.length,
            note: t("private.processDescription"),
          },
        ]}
      />
      <div className="core-role-grid">
        <section className="core-card core-role-panel">
          <div className="core-card__header">
            <div>
              <h2>
                {t("private.monitoringPanel", "Seguimiento y observaciones")}
              </h2>
              <p>
                {t(
                  "private.moderatorIntro",
                  "Revisa el trabajo registrado y añade información confirmada por el equipo.",
                )}
              </p>
            </div>
            <ClipboardList size={20} />
          </div>
          <Link className="core-card__link" to="/observaciones">
            {t("private.recordWork")} <ChevronDown size={15} />
          </Link>
        </section>
        <section className="core-card core-context">
          <div className="core-card__header">
            <div>
              <h2>{t("private.lifecycle")}</h2>
              <p>{t("private.lifecycleDescription")}</p>
            </div>
          </div>
          {lifecycleStages.slice(0, 3).map((stage) => (
            <div className="core-context__item" key={stage.id}>
              <span>{t(`lifecycle.${stage.id}.name`)}</span>
              <strong>{t(`lifecycle.${stage.id}.description`)}</strong>
            </div>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}

function UserDashboard() {
  const { t } = useTranslation();
  const activities = t("content.howWeWork", { returnObjects: true });
  return (
    <DashboardShell
      role="user"
      title={t("private.userDashboard", "Panel de colaborador")}
      eyebrow={t("private.userArea", "Información del proyecto")}
    >
      <RoleWidgets
        widgets={[
          {
            icon: Waves,
            label: t("private.lifecycle"),
            value: lifecycleStages.length,
            note: t("private.lifecycleDescription"),
          },
          {
            icon: Map,
            label: t("private.referencePoints", "Puntos de referencia"),
            value: getMapPointRecords().length,
            note: t("common.demo", "Datos demo"),
          },
          {
            icon: Activity,
            label: t("private.workSteps", "Pasos de trabajo"),
            value: activities.length,
            note: t("private.processDescription"),
          },
          {
            icon: Users,
            label: t("private.participation"),
            value: "RC",
            note: t("private.collaborative"),
          },
        ]}
      />
      <section className="core-card core-context">
        <div className="core-card__header">
          <div>
            <h2>{t("private.why")}</h2>
            <p>{t("private.reefImportance")}</p>
          </div>
        </div>
        <p>{t("content.whyRestore")}</p>
        <div className="core-context__item">
          <span>{t("private.location")}</span>
          <strong>{t("content.location")}</strong>
        </div>
      </section>
    </DashboardShell>
  );
}

function CoreDashboard() {
  const { user } = useAuth();
  const role = user?.role || "USER";
  if (role === "ADMIN") return <AdminDashboard />;
  if (role === "MODERATOR") return <ModeratorDashboard />;
  return <UserDashboard />;
}

export { CoreDashboard };
