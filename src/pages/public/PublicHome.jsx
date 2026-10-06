import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Fish, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import descentBackground from '../../assets/isla-tortuga-long-scroll.png';
import { lifecycleStages, projectInfo } from '../../services/projectData.js';
import { lifecycleAssets } from '../../services/lifecycleAssets.js';
import '../../public-home.css';
import '../../interactive-public-pages.css';

const stories = [
  { id: 'location', label: 'Dónde', heading: projectInfo.location, description: projectInfo.locationDescription, marker: '01' },
  { id: 'process', label: 'Cómo', heading: 'Restaurar requiere tiempo, cuidado y conocimiento.', description: projectInfo.howWeWork.join(' '), marker: '02' },
  { id: 'collaboration', label: 'Quiénes', heading: 'Un trabajo entre muchas personas.', description: projectInfo.collaboration, marker: '03' },
];

export function PublicHome() {
  const [activeId, setActiveId] = useState(stories[0].id);
  const [activeStageId, setActiveStageId] = useState(lifecycleStages[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeStory = stories.find((story) => story.id === activeId) ?? stories[0];
  const activeStage = lifecycleStages.find((stage) => stage.id === activeStageId) ?? lifecycleStages[0];
  const immersionProgress = Math.min(scrollProgress * 3.2, 1);
  const activeStageIndex = lifecycleStages.indexOf(activeStage);
  const activeStageAsset = lifecycleAssets[activeStage.id];
  const changeStage = (nextIndex) => setActiveStageId(lifecycleStages[(nextIndex + lifecycleStages.length) % lifecycleStages.length].id);

  useEffect(() => {
    const updateDepth = () => setScrollProgress(Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1));
    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });
    return () => window.removeEventListener('scroll', updateDepth);
  }, []);

  useEffect(() => {
    const revealItems = [...document.querySelectorAll('.vh-reveal')];
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (reduce || !('IntersectionObserver' in window)) { revealItems.forEach((item) => item.classList.add('is-visible')); return undefined; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.16 });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return <main className="velorah-home" style={{ '--vh-scroll': scrollProgress, '--vh-depth': immersionProgress, '--vh-underwater-image': `url(${descentBackground})` }}>
    <div className="vh-water-atmosphere" aria-hidden="true" />
    <div className="vh-depth-meter" aria-hidden="true"><span className="vh-depth-meter__line"><i style={{ transform: `scaleY(${Math.max(scrollProgress, 0.08)})` }} /></span><span>Superficie</span><span>Zona submarina</span></div>
    <section className="vh-hero" aria-labelledby="home-title"><div className="vh-hero__image" aria-hidden="true" /><div className="vh-hero__content"><p className="vh-kicker"><Waves size={15} /> {projectInfo.location}</p><h1 id="home-title">Restauración coralina,<br /><em>un trabajo colectivo.</em></h1><p className="vh-hero__intro">Conocer el ciclo de vida del coral y acompañar su recuperación mediante cuidado, seguimiento y colaboración.</p><div className="vh-actions"><Link className="vh-button vh-button--light" to="/proyecto">Conocer el proyecto <ArrowRight size={16} /></Link><Link className="vh-button vh-button--glass" to="/galeria">Ver el ciclo de vida</Link></div></div><button className="vh-scroll" type="button" onClick={() => document.getElementById('seguimiento')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })}><span>Seguir explorando</span><ArrowDown size={15} /></button></section>
    <section className="vh-facts vh-reveal" aria-label="Información sobre restauración coralina"><div className="vh-facts__intro"><h2>Restaurar es cuidar <em>todo un ecosistema.</em></h2><p>{projectInfo.whyRestore}</p></div><div className="vh-facts__grid"><article className="vh-fact-card"><strong>01</strong><h3>Selección responsable</h3><p>El proceso comienza con la selección y recolección responsable de fragmentos de coral.</p></article><article className="vh-fact-card"><strong>02</strong><h3>Guarderías marinas</h3><p>Los fragmentos se preparan y colocan en estructuras para favorecer su crecimiento y monitoreo.</p></article><article className="vh-fact-card"><strong>03</strong><h3>Cuidado continuo</h3><p>Durante su desarrollo se realizan labores de limpieza, mantenimiento y seguimiento.</p></article></div></section>
    <section className="vh-statement vh-reveal" id="seguimiento"><h2>Mirar de cerca.<br /><em>Registrar con cuidado.</em></h2><p>{projectInfo.collaboration}</p></section>
    <section className="vh-feature vh-reveal" aria-labelledby="feature-title"><div className="vh-feature__copy"><h2 id="feature-title">Un arrecife.<br /><em>Muchas personas.</em></h2><div className="vh-tabs" role="tablist" aria-label="Aspectos de la restauración">{stories.map((story) => <button key={story.id} type="button" role="tab" id={`tab-${story.id}`} aria-selected={story.id === activeId} aria-controls="story-panel" onClick={() => setActiveId(story.id)}>{story.label}</button>)}</div><div className="vh-story" id="story-panel" role="tabpanel" aria-labelledby={`tab-${activeStory.id}`}><span className="vh-story__marker">{activeStory.marker}</span><h3>{activeStory.heading}</h3><p>{activeStory.description}</p></div><div className="vh-feature__links"><Link className="vh-text-link" to="/proyecto">Conocer el trabajo <ArrowRight size={16} /></Link><a className="vh-text-link vh-text-link--corals" href="#corales">Ver las etapas <ArrowDown size={16} /></a></div></div><div className="vh-feature__visual" role="img" aria-label="Arrecife coralino ilustrativo"><div className="vh-visual__wash" /><Fish className="vh-visual__fish" size={34} aria-hidden="true" /></div></section>
    <section className="vh-reef vh-reveal" id="corales" aria-labelledby="reef-title"><div className="vh-reef__intro"><h2 id="reef-title">Ciclo de vida del coral<br /><em>paso a paso.</em></h2><p>El ciclo comprende gametos, embrión, larva, asentamiento en sustrato, coral juvenil y coral adulto.</p></div><div className="vh-reef__scene vh-lifecycle-scene" role="group" aria-label="Carrusel interactivo de las etapas del ciclo de vida del coral"><div className="lifecycle-stage-visual lifecycle-stage-visual--home" aria-label={`Modelo interactivo de ${activeStage.name}`}><button className={`lifecycle-model lifecycle-model--${activeStage.id}`} type="button" aria-label={`Destacar ${activeStage.name}`}><img className="lifecycle-model__image" src={activeStageAsset} alt="" aria-hidden="true" decoding="async" loading="lazy" width="1254" height="1254" /><span className="lifecycle-model__halo" aria-hidden="true" /><span className="lifecycle-stage-tooltip"><strong>{activeStage.name}</strong><small>{activeStage.description}</small></span></button><div className="lifecycle-stage-visual__waterline" aria-hidden="true" /></div><div className="vh-coral-card" aria-live="polite"><strong>{activeStage.name}</strong><p>{activeStage.description}</p></div><div className="vh-lifecycle-controls"><button type="button" aria-label="Etapa anterior" onClick={() => changeStage(activeStageIndex - 1)}><ArrowLeft size={15} /></button><button type="button" aria-label="Etapa siguiente" onClick={() => changeStage(activeStageIndex + 1)}><ArrowRight size={15} /></button></div><div className="vh-lifecycle-rail" role="tablist" aria-label="Seleccionar etapa del ciclo de vida">{lifecycleStages.map((item, index) => <button className={activeStage.id === item.id ? 'is-active' : ''} key={item.id} type="button" role="tab" aria-selected={activeStage.id === item.id} onClick={() => setActiveStageId(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><small>{item.name}</small></button>)}</div></div></section>
    <section className="vh-cta vh-reveal"><h2>La restauración empieza<br /><em>con conocimiento.</em></h2><p>Conoce el lugar, el proceso y el ciclo de vida del coral.</p><Link className="vh-button vh-button--light" to="/proyecto">Conocer la restauración <ArrowRight size={16} /></Link></section>
    <button className={`vh-back-top${scrollProgress > 0.22 ? ' is-visible' : ''}`} type="button" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={16} /></button>
  </main>;
}
