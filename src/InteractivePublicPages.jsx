import { useState } from 'react';
import { ArrowRight, Camera, MapPin, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import './interactive-public-pages.css';

const demoCorals = [
  { id: 'c1', code: 'RC-001', species: 'Porites sp.', status: 'Vivo', zone: 'Zona Carolina Norte' },
  { id: 'c2', code: 'RC-002', species: 'Pocillopora sp.', status: 'En revisión', zone: 'Sector Tortuga Sur' },
  { id: 'c3', code: 'RC-003', species: 'Por confirmar', status: 'Pendiente', zone: 'Sector Tortuga Sur' },
];

export function InteractiveMapPage() {
  const [activeZone, setActiveZone] = useState('Todas');
  const [activeId, setActiveId] = useState(demoCorals[0].id);
  const zones = ['Todas', ...new Set(demoCorals.map((coral) => coral.zone))];
  const visibleCorals = activeZone === 'Todas' ? demoCorals : demoCorals.filter((coral) => coral.zone === activeZone);
  const activeCoral = demoCorals.find((coral) => coral.id === activeId) ?? demoCorals[0];

  return <main className="public-page interactive-page"><section className="interactive-hero"><div><p className="vh-kicker"><Waves size={15} /> Exploración · vista demostrativa</p><h1>Zonas de<br /><em>seguimiento.</em></h1><p>Explora una representación submarina de registros de muestra. El mapa es ilustrativo y no publica coordenadas sensibles.</p></div></section><section className="public-content public-content--map interactive-map-layout"><div className="public-map interactive-map" role="group" aria-label="Representación ilustrativa de zonas, sin coordenadas geográficas"><div className="public-map__label"><MapPin size={15} /> Golfo de Nicoya · ilustración</div>{demoCorals.map((coral, index) => <button className={`public-map__reef public-map__reef--${index + 1}${activeId === coral.id ? ' is-active' : ''}`} key={coral.id} type="button" aria-label={`Ver ${coral.code}`} aria-pressed={activeId === coral.id} onClick={() => setActiveId(coral.id)} />)}<div className="public-map__callout"><span>{activeCoral.code}</span><strong>{activeCoral.zone}</strong><small>Registro demo · {activeCoral.status}</small></div><div className="public-map__note">Mapa demostrativo<br />Ubicaciones no geográficas</div></div><div className="public-list"><div className="public-list__heading"><div><p className="vh-kicker">Registros asociados</p><h2>Corales de muestra</h2></div><span>{visibleCorals.length} de {demoCorals.length}</span></div><div className="public-filter" role="group" aria-label="Filtrar por zona">{zones.map((zone) => <button className={activeZone === zone ? 'is-active' : ''} key={zone} type="button" onClick={() => setActiveZone(zone)}>{zone}</button>)}</div>{visibleCorals.map((coral) => <Link className={`public-record${activeId === coral.id ? ' is-selected' : ''}`} key={coral.id} to={`/corales/${coral.id}`} onMouseEnter={() => setActiveId(coral.id)} onFocus={() => setActiveId(coral.id)}><span className="public-record__code">{coral.code}</span><span className="public-record__details"><b>{coral.species}</b><small>{coral.zone}</small></span><em>{coral.status}</em><ArrowRight size={16} /></Link>)}</div></section></main>;
}

const galleryImages = [
  { src: 'photo-1546026423-cc4642628d2b', alt: 'Arrecife coralino bajo el agua', label: 'Arrecife · referencia' },
  { src: 'photo-1544551763-46a013bb70d5', alt: 'Buceo recreativo en aguas tropicales', label: 'Visita · referencia' },
  { src: 'photo-1518467166778-b88f373ffec7', alt: 'Vida marina en un arrecife', label: 'Vida marina · referencia' },
];

export function InteractiveGallery() {
  const [activeImage, setActiveImage] = useState(0);
  const image = galleryImages[activeImage];
  return <main className="public-page interactive-page"><section className="interactive-hero interactive-hero--gallery"><div><p className="vh-kicker"><Camera size={15} /> Galería · imágenes ilustrativas</p><h1>Una ventana<br /><em>bajo el agua.</em></h1><p>Selecciona una referencia visual para explorar cómo puede organizarse la evidencia del proyecto.</p></div></section><section className="interactive-gallery"><div className="interactive-gallery__hero"><img src={`https://images.unsplash.com/${image.src}?auto=format&fit=crop&w=1500&q=85`} alt={image.alt} /><div><p className="vh-kicker"><Camera size={14} /> {image.label}</p><h2>Mirar antes de<br /><em>interpretar.</em></h2><p>Imagen de referencia. No representa una observación de campo del proyecto.</p></div></div><div className="interactive-gallery__rail" role="tablist" aria-label="Seleccionar imagen de referencia">{galleryImages.map((item, index) => <button className={activeImage === index ? 'is-active' : ''} key={item.src} type="button" role="tab" aria-selected={activeImage === index} onClick={() => setActiveImage(index)}><img src={`https://images.unsplash.com/${item.src}?auto=format&fit=crop&w=500&q=75`} alt="" /><span>0{index + 1}<small>{item.label}</small></span></button>)}</div></section></main>;
}
