import { Activity, Camera, LogOut, Map, Waves } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider.jsx';

export function PrivateLayout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return <div className={`private${collapsed ? ' private--collapsed' : ''}`}><aside><Link className="brand" to="/dashboard" aria-label="Mostrar u ocultar menú Carolina" aria-expanded={!collapsed} onClick={(event) => { event.preventDefault(); setCollapsed((current) => !current); }}><Waves size={20} /> <span>Carolina</span></Link><p className="eyebrow">Sesión activa</p><strong>{user?.name}</strong><small>{user?.role}</small><Link to="/dashboard"><Activity size={16} /> <span>Dashboard</span></Link><Link to="/mapa"><Map size={16} /> <span>Mapa</span></Link><Link to="/observaciones"><Camera size={16} /> <span>Observaciones</span></Link><button className="button ghost" onClick={logout}><LogOut size={15} /> Salir</button></aside><main className="private-main"><Outlet /></main></div>;
}
