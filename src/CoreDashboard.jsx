import { useEffect, useState } from 'react';
import { Activity, Bell, CalendarDays, ChevronDown, CloudDownload, Fish, Menu, Moon, Search, ShieldCheck, Sun, Waves } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';

const trafficData = [
  { month: 'Jun', vivo: 8, revision: 2 },
  { month: 'Jul', vivo: 12, revision: 3 },
  { month: 'Ago', vivo: 17, revision: 2 },
  { month: 'Sep', vivo: 21, revision: 3 },
  { month: 'Oct', vivo: 24, revision: 4 },
  { month: 'Nov', vivo: 27, revision: 3 },
];

const widgets = [
  { value: '26', label: 'Registros demo', note: '+12.4% desde la última visita', tone: 'violet', points: '4,27 24,32 45,15 66,18 87,38 108,29 128,40' },
  { value: '08', label: 'Zonas de muestra', note: '+4.9% con contexto asociado', tone: 'blue', points: '4,39 24,22 45,31 66,23 87,8 108,19 128,28' },
  { value: '03', label: 'En observación', note: 'Requieren revisión experta', tone: 'amber', points: '4,10 24,9 45,12 66,29 87,34 108,27 128,14' },
  { value: '21', label: 'Corales con estado vivo', note: '+8.1% en la serie ilustrativa', tone: 'coral', bars: [36, 45, 30, 55, 42, 70, 48, 64, 50, 72, 58, 76] },
];

function MiniLine({ points }) {
  return <svg className="core-widget__line" viewBox="0 0 132 48" role="img" aria-label="Tendencia ilustrativa"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="128" cy={points.split(' ').at(-1).split(',')[1]} r="2.5" fill="currentColor" /></svg>;
}

function CoreDashboard() {
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem('rc_dashboard_theme') === 'dark');
  useEffect(() => { document.documentElement.dataset.dashboardTheme = darkTheme ? 'dark' : 'light'; }, [darkTheme]);
  const toggleTheme = () => setDarkTheme((current) => { const next = !current; localStorage.setItem('rc_dashboard_theme', next ? 'dark' : 'light'); return next; });
  return <section className={`core-dashboard${darkTheme ? ' core-dashboard--dark' : ''}`}>
    <header className="core-dashboard__topbar"><button className="core-icon-button" type="button" aria-label="Abrir menú"><Menu size={19} /></button><div className="core-search"><Search size={16} /><span>Buscar</span><kbd>Ctrl</kbd><kbd>/</kbd></div><div className="core-topbar__actions"><button className="core-icon-button" type="button" aria-label="Notificaciones"><Bell size={18} /></button><button className="core-icon-button" type="button" aria-label="Actividad"><Activity size={18} /></button><button className="core-icon-button core-theme-toggle" type="button" aria-label={darkTheme ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'} aria-pressed={darkTheme} onClick={toggleTheme}>{darkTheme ? <Sun size={18} /> : <Moon size={18} />}</button><button className="core-icon-button core-topbar__avatar" type="button" aria-label="Perfil">BD</button></div></header>
    <div className="core-dashboard__body"><nav className="core-breadcrumb" aria-label="Migas de pan"><Link to="/dashboard">Inicio</Link><span>/</span><strong>Dashboard</strong></nav><div className="core-dashboard__heading"><div><p className="eyebrow"><Waves size={14} /> Área de seguimiento</p><h1>Estado de restauración</h1></div><span className="core-demo-pill"><ShieldCheck size={14} /> Datos demostrativos</span></div>
      <div className="core-widgets">{widgets.map((widget) => <article className={`core-widget core-widget--${widget.tone}`} key={widget.label}><div className="core-widget__top"><strong>{widget.value}</strong><span>+ </span></div><p>{widget.label}</p><small>{widget.note}</small>{widget.points ? <MiniLine points={widget.points} /> : <div className="core-widget__bars">{widget.bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>}</article>)}</div>
      <section className="core-card core-traffic"><div className="core-card__header"><div><h2>Seguimiento</h2><p>Serie ilustrativa · Junio 2026 – Noviembre 2026</p></div><div className="core-card__tools"><div className="core-segmented"><button type="button">Día</button><button className="is-active" type="button">Mes</button><button type="button">Año</button></div><button className="core-download" type="button" aria-label="Descargar resumen"><CloudDownload size={17} /></button></div></div><div className="core-chart"><ResponsiveContainer width="100%" height={300}><LineChart data={trafficData} margin={{ top: 20, right: 12, left: -18, bottom: 0 }}><CartesianGrid stroke="rgba(125, 150, 170, .16)" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8793a8', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8793a8', fontSize: 12 }} /><Tooltip contentStyle={{ background: '#252d3b', border: '1px solid #3a4558', borderRadius: 6, color: '#fff' }} /><Line type="monotone" dataKey="vivo" name="Estado vivo" stroke="#3c9eea" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="revision" name="En observación" stroke="#e16668" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div><div className="core-traffic__footer"><span><i className="core-legend core-legend--blue" />Estado vivo <strong>27 registros</strong></span><span><i className="core-legend core-legend--red" />En observación <strong>03 registros</strong></span><span><i className="core-legend core-legend--mint" />Pendientes <strong>01 registro</strong></span></div></section>
      <div className="core-lower-grid"><section className="core-card core-activity"><div className="core-card__header"><div><h2>Últimas observaciones</h2><p>Registros recientes del prototipo</p></div><CalendarDays size={18} /></div><div className="core-table-wrap"><table><thead><tr><th>Registro</th><th>Zona</th><th>Estado</th><th>Fecha</th></tr></thead><tbody><tr><td><Fish size={15} /> RC-001</td><td>Carolina Norte</td><td><span className="core-status core-status--green">Vivo</span></td><td>20 Sep 2026</td></tr><tr><td><Fish size={15} /> RC-002</td><td>Tortuga Sur</td><td><span className="core-status core-status--red">Revisión</span></td><td>18 Sep 2026</td></tr><tr><td><Fish size={15} /> RC-003</td><td>Tortuga Sur</td><td><span className="core-status core-status--amber">Pendiente</span></td><td>14 Sep 2026</td></tr></tbody></table></div><Link className="core-card__link" to="/observaciones">Ver todas las observaciones <ChevronDown size={15} /></Link></section><section className="core-card core-context"><div className="core-card__header"><div><h2>Contexto del dato</h2><p>Antes de interpretar</p></div><ShieldCheck size={18} /></div><div className="core-context__item"><span>Origen</span><strong>Demostrativo</strong></div><div className="core-context__item"><span>Validación</span><strong className="is-waiting">Pendiente de revisión</strong></div><div className="core-context__item"><span>Evidencia disponible</span><strong>2 de 3 fichas</strong></div><div className="core-progress"><span style={{ width: '67%' }} /></div><small>La información real debe ser confirmada por el equipo del proyecto.</small></section></div>
    </div>
  </section>;
}

export { CoreDashboard };
