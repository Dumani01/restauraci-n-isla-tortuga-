import { Activity, Camera, LogOut, Moon, ShieldCheck, Sun, UserPlus, Waves } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider.jsx';
import { NarratorControls } from '../accessibility/NarratorControls.jsx';
import { TextSettings } from '../accessibility/TextSettings.jsx';
import { useTheme } from '../theme/ThemeProvider.jsx';

export function PrivateLayout() {
  const { t } = useTranslation(); const { user, logout } = useAuth(); const { isDark, toggleTheme } = useTheme(); const [collapsed, setCollapsed] = useState(false);
  return <div className={`private${collapsed ? ' private--collapsed' : ''}`}><aside><Link className="brand" to="/dashboard" aria-label={t('private.openMenu')} aria-expanded={!collapsed} title={t('private.openMenu')} onClick={(event) => { event.preventDefault(); setCollapsed((current) => !current); }}><Waves size={20} /> <span>Restauración Coralina</span></Link><button className="button ghost private-logout" aria-label={t('common.logout')} title={t('common.logout')} onClick={logout}><LogOut size={15} /> <span>{t('common.logout')}</span></button><p className="eyebrow">{t('private.session')}</p><strong>{user?.name}</strong><small>{user?.profile || user?.role}</small><Link to="/dashboard" aria-label={t('private.dashboard')} title={t('private.dashboard')}><Activity size={16} /> <span>{t('private.dashboard')}</span></Link><Link to="/observaciones" aria-label={t('private.observations')} title={t('private.observations')}><Camera size={16} /> <span>{t('private.observations')}</span></Link>{user?.role === 'ADMIN' && <Link to="/admin/usuarios" aria-label={t('private.userManagement', 'Usuarios')} title={t('private.userManagement', 'Usuarios')}><UserPlus size={16} /> <span>{t('private.userManagement', 'Usuarios')}</span></Link>}{user?.role === 'ADMIN' && <small className="private-role-badge"><ShieldCheck size={13} /> ADMIN</small>}<TextSettings /><NarratorControls /><button className="theme-toggle theme-toggle--private" type="button" aria-label={isDark ? t('common.lightTheme') : t('common.darkTheme')} title={isDark ? t('common.lightTheme') : t('common.darkTheme')} aria-pressed={isDark} onClick={toggleTheme}>{isDark ? <Sun size={16} /> : <Moon size={16} />} <span>{isDark ? t('common.lightTheme') : t('common.darkTheme')}</span></button></aside><main className="private-main"><Outlet /></main></div>;
}
