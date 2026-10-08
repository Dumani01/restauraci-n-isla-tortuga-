import { Activity, Camera, LogOut, Map, Moon, ShieldCheck, Sun, UserPlus, Waves } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider.jsx';
import { NarratorControls } from '../accessibility/NarratorControls.jsx';
import { TextSettings } from '../accessibility/TextSettings.jsx';
import { useTheme } from '../theme/ThemeProvider.jsx';

export function PrivateLayout() {
  const { t } = useTranslation(); const { user, logout } = useAuth(); const { isDark, toggleTheme } = useTheme(); const [collapsed, setCollapsed] = useState(false);
  return <div className={`private${collapsed ? ' private--collapsed' : ''}`}><aside><Link className="brand" to="/dashboard" aria-label={t('private.openMenu')} aria-expanded={!collapsed} onClick={(event) => { event.preventDefault(); setCollapsed((current) => !current); }}><Waves size={20} /> <span>RestauraciÃ³n Coralina</span></Link><p className="eyebrow">{t('private.session')}</p><strong>{user?.name}</strong><small>{user?.profile || user?.role}</small><Link to="/dashboard"><Activity size={16} /> <span>{t('private.dashboard')}</span></Link><Link to="/mapa"><Map size={16} /> <span>{t('nav.map')}</span></Link><Link to="/observaciones"><Camera size={16} /> <span>{t('private.observations')}</span></Link>{user?.role === 'ADMIN' && <Link to="/admin/usuarios"><UserPlus size={16} /> <span>{t('private.userManagement', 'Usuarios')}</span></Link>}{user?.role === 'ADMIN' && <small className="private-role-badge"><ShieldCheck size={13} /> ADMIN</small>}<TextSettings /><NarratorControls /><button className="theme-toggle theme-toggle--private" type="button" aria-label={isDark ? t('common.lightTheme') : t('common.darkTheme')} aria-pressed={isDark} onClick={toggleTheme}>{isDark ? <Sun size={16} /> : <Moon size={16} />} <span>{isDark ? t('common.lightTheme') : t('common.darkTheme')}</span></button><button className="button ghost" onClick={logout}><LogOut size={15} /> {t('common.logout')}</button></aside><main className="private-main"><Outlet /></main></div>;
}
