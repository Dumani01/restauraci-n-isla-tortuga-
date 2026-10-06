import { Activity, Camera, LogOut, Map, Waves } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider.jsx';
import { NarratorControls } from '../accessibility/NarratorControls.jsx';

export function PrivateLayout() {
  const { t } = useTranslation(); const { user, logout } = useAuth(); const [collapsed, setCollapsed] = useState(false);
  return <div className={`private${collapsed ? ' private--collapsed' : ''}`}><aside><Link className="brand" to="/dashboard" aria-label={t('private.openMenu')} aria-expanded={!collapsed} onClick={(event) => { event.preventDefault(); setCollapsed((current) => !current); }}><Waves size={20} /> <span>Restauración Coralina</span></Link><p className="eyebrow">{t('private.session')}</p><strong>{user?.name}</strong><small>{user?.role}</small><Link to="/dashboard"><Activity size={16} /> <span>{t('private.dashboard')}</span></Link><Link to="/mapa"><Map size={16} /> <span>{t('nav.map')}</span></Link><Link to="/observaciones"><Camera size={16} /> <span>{t('private.observations')}</span></Link><NarratorControls /><button className="button ghost" onClick={logout}><LogOut size={15} /> {t('common.logout')}</button></aside><main className="private-main"><Outlet /></main></div>;
}
