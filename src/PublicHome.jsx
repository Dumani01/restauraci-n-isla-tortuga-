import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Fish, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import branchingCoral from './assets/coral-branching.png';
import brainCoral from './assets/coral-brain.png';
import fanCoral from './assets/coral-fan.png';
import descentBackground from './assets/isla-tortuga-long-scroll.png';
import './public-home.css';

const stories = [
  {
    id: 'zones',
    label: 'Zonas',
    heading: 'Cada lugar tiene su propio contexto.',
    description: 'Consulta la vista demostrativa de las zonas y sus registros relacionados, sin publicar coordenadas sensibles.',
    marker: '02',
  },
  {
    id: 'observations',
    label: 'Observaciones',
    heading: 'Una visita deja un registro trazable.',
    description: 'Fecha, responsable, estado, evidencia y validación forman parte de cada observación del prototipo.',
    marker: '01',
  },
  {
    id: 'evidence',
    label: 'Evidencia',
    heading: 'Los datos incompletos también importan.',
    description: 'La información demostrativa se distingue de los datos de campo y queda sujeta a revisión experta.',
    marker: '03',
  },
];

const coralCards = [
  { id: 'c1', code: 'RC-001', label: 'Estructura de muestra', status: 'Vivo · demo', copy: 'Registro ilustrativo preparado para probar el seguimiento por visita.' },
  { id: 'c2', code: 'RC-002', label: 'Observación pendiente', status: 'Por validar · demo', copy: 'La ficha reserva un espacio para evidencia y revisión del equipo.' },
  { id: 'c3', code: 'RC-003', label: 'Coral sin confirmar', status: 'Pendiente · demo', copy: 'La especie no se muestra hasta contar con una identificación verificada.' },
];

const coralAssets = [branchingCoral, brainCoral, fanCoral];

export function PublicHome() {
  const [activeId, setActiveId] = useState(stories[0].id);
  const [activeCoralId, setActiveCoralId] = useState(coralCards[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeStory = stories.find((story) => story.id === activeId) ?? stories[0];
  const activeCoral = coralCards.find((coral) => coral.id === activeCoralId) ?? coralCards[0];
  const immersionProgress = Math.min(scrollProgress * 3.2, 1);

  useEffect(() => {
    const updateDepth = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };
    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });
    return () => window.removeEventListener('scroll', updateDepth);
  }, []);

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('.vh-reveal')];
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (reduce || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.16 });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="velorah-home" style={{ '--vh-scroll': scrollProgress, '--vh-depth': immersionProgress, '--vh-underwater-image': `url(${descentBackground})` }}>
      <div className="vh-water-atmosphere" aria-hidden="true" />
      <div className="vh-depth-meter" aria-hidden="true"><span className="vh-depth-meter__line"><i style={{ transform: `scaleY(${Math.max(scrollProgress, 0.08)})` }} /></span><span>Superficie</span><span>Zona submarina</span></div>
      <section className="vh-hero" aria-labelledby="home-title">
        <div className="vh-hero__image" aria-hidden="true" />
        <div className="vh-hero__content">
          <p className="vh-kicker"><Waves size={15} /> Isla Tortuga · Golfo de Nicoya</p>
          <h1 id="home-title">Restauración coralina,<br /><em>en observación.</em></h1>
          <p className="vh-hero__intro">Un espacio para documentar corales, estructuras y visitas con transparencia sobre lo que sabemos y lo que aún falta validar.</p>
          <div className="vh-actions">
            <Link className="vh-button vh-button--light" to="/proyecto">Conocer el proyecto <ArrowRight size={16} /></Link>
            <Link className="vh-button vh-button--glass" to="/mapa">Explorar zonas</Link>
          </div>
        </div>
        <a className="vh-scroll" href="#seguimiento"><span>Seguir explorando</span><ArrowDown size={15} /></a>
      </section>

      <section className="vh-facts vh-reveal" aria-label="Resumen demostrativo del prototipo">
        <div className="vh-facts__intro">
          <h2>El estado del proyecto, <em>sin perder el contexto.</em></h2>
          <p>Indicadores de demostración para explorar la interfaz. No representan resultados verificados de campo.</p>
        </div>
        <div className="vh-facts__grid">
          <article className="vh-fact-card"><strong>21</strong><h3>Registros demo</h3><p>Observaciones de ejemplo preparadas para probar el seguimiento.</p></article>
          <article className="vh-fact-card"><strong>03</strong><h3>Zonas de muestra</h3><p>Contextos visuales sin coordenadas sensibles ni ubicaciones confirmadas.</p></article>
          <article className="vh-fact-card"><strong>01</strong><h3>Regla principal</h3><p>Distinguir lo demostrativo de lo verificado antes de tomar decisiones.</p></article>
        </div>
      </section>

      <section className="vh-statement vh-reveal" id="seguimiento">
        <h2>Mirar de cerca.<br /><em>Registrar con cuidado.</em></h2>
        <p>El prototipo reúne observaciones y contexto para apoyar una evaluación preliminar. No reemplaza permisos, protocolos científicos ni revisión de especialistas.</p>
      </section>

      <section className="vh-feature vh-reveal" aria-labelledby="feature-title">
        <div className="vh-feature__copy">
          <h2 id="feature-title">Un arrecife.<br /><em>Muchas preguntas.</em></h2>
          <div className="vh-tabs" role="tablist" aria-label="Aspectos del seguimiento">
            {stories.map((story) => (
              <button
                key={story.id}
                type="button"
                role="tab"
                id={`tab-${story.id}`}
                aria-selected={story.id === activeId}
                aria-controls="story-panel"
                onClick={() => setActiveId(story.id)}
              >
                {story.label}
              </button>
            ))}
          </div>
          <div className="vh-story" id="story-panel" role="tabpanel" aria-labelledby={`tab-${activeStory.id}`}>
            <span className="vh-story__marker">{activeStory.marker}</span>
            <h3>{activeStory.heading}</h3>
            <p>{activeStory.description}</p>
          </div>
          <div className="vh-feature__links"><Link className="vh-text-link" to="/mapa">Ver zonas y registros <ArrowRight size={16} /></Link><a className="vh-text-link vh-text-link--corals" href="#corales">Bajar al arrecife <ArrowDown size={16} /></a></div>
        </div>
        <div className="vh-feature__visual" role="img" aria-label="Vista submarina ilustrativa de un arrecife" >
          <div className="vh-visual__wash" />
          <Fish className="vh-visual__fish" size={34} aria-hidden="true" />
        </div>
      </section>

      <section className="vh-reef vh-reveal" id="corales" aria-labelledby="reef-title">
        <div className="vh-reef__intro">
          <h2 id="reef-title">Conocer el arrecife<br /><em>poco a poco.</em></h2>
          <p>Al descender, el paisaje cambia y aparecen fichas interactivas. Cada una representa un registro de muestra; no son resultados científicos.</p>
        </div>
        <div className="vh-reef__scene" role="group" aria-label="Corales interactivos de muestra">
          <div className="vh-reef__rays" aria-hidden="true" />
          <div className="vh-reef__sand" aria-hidden="true" />
          {coralCards.map((coral, index) => (
            <button
              className={`vh-coral vh-coral--${index + 1}${coral.id === activeCoralId ? ' is-active' : ''}`}
              key={coral.id}
              type="button"
              aria-label={`Ver información de ${coral.code}`}
              aria-pressed={coral.id === activeCoralId}
              onClick={() => setActiveCoralId(coral.id)}
            >
              <img className="vh-coral__image" src={coralAssets[index]} alt="" aria-hidden="true" />
              <span className="vh-coral__bubble" aria-hidden="true" />
              <span className="vh-coral__code">{coral.code}</span>
            </button>
          ))}
          <div className="vh-coral-card" aria-live="polite">
            <strong>{activeCoral.label}</strong>
            <p>{activeCoral.copy}</p>
          </div>
          <span className="vh-reef__caption">Toca un coral para consultar su ficha</span>
        </div>
      </section>

      <section className="vh-cta vh-reveal">
        <h2>La evidencia empieza<br /><em>con una visita.</em></h2>
        <p>Explora el estado actual del prototipo y sus datos de ejemplo.</p>
        <Link className="vh-button vh-button--light" to="/mapa">Ir a la exploración <ArrowRight size={16} /></Link>
      </section>
      <button className={`vh-back-top${scrollProgress > 0.22 ? ' is-visible' : ''}`} type="button" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ArrowUp size={16} />
      </button>
    </main>
  );
}
