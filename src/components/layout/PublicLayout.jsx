import { NavLink, Link, Outlet } from 'react-router-dom';
import { ArrowRight, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector.jsx';
import { NarratorControls } from '../accessibility/NarratorControls.jsx';

export function PublicLayout() {
  const { t } = useTranslation();
  return <div className="public-site">
    <header className="public-header">
      <Link className="brand" to="/"><Waves size={20} /> <span>Restauración Coralina</span></Link>
      <nav className="public-nav" aria-label={t('nav.main')}>
        <NavLink to="/proyecto">{t('nav.project')}</NavLink><NavLink to="/mapa">{t('nav.map')}</NavLink><NavLink to="/galeria">{t('nav.gallery')}</NavLink><NavLink to="/noticias">{t('nav.news')}</NavLink><LanguageSelector /><NarratorControls /><NavLink className="public-nav__access" to="/login">{t('nav.access')} <ArrowRight size={14} /></NavLink>
      </nav>
    </header>
    <Outlet />
    <footer className="public-footer"><Link className="brand" to="/"><Waves size={18} /> Restauración Coralina</Link><span>{t('footer')}</span></footer>
  </div>;
}
