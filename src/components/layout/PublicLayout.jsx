import { NavLink, Link, Outlet } from 'react-router-dom';
import { ArrowRight, Waves } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="brand" to="/"><Waves size={20} /> <span>Restauración Carolina</span></Link>
        <nav className="public-nav" aria-label="Navegación principal">
          <NavLink to="/proyecto">Proyecto</NavLink>
          <NavLink to="/mapa">Mapa</NavLink>
          <NavLink to="/galeria">Galería</NavLink>
          <NavLink to="/noticias">Noticias</NavLink>
          <NavLink className="public-nav__access" to="/login">Acceso <ArrowRight size={14} /></NavLink>
        </nav>
      </header>
      <Outlet />
      <footer className="public-footer"><Link className="brand" to="/"><Waves size={18} /> Restauración Carolina</Link><span>Información sobre restauración coralina · Isla Tortuga</span></footer>
    </div>
  );
}
