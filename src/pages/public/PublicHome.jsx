import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Fish, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../i18n/index.js';
import descentBackground from '../../assets/isla-tortuga-long-scroll.png';
import descentNightBackground from '../../assets/isla-tortuga-long-scroll-night.png';
import { projectInfo } from '../../services/projectData.js';
import { useTheme } from '../../components/theme/ThemeProvider.jsx';
import { CoralTimeline } from '../../components/public/CoralTimeline.jsx';
import '../../public-home.css';
import '../../interactive-public-pages.css';

export function PublicHome() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [activeId, setActiveId] = useState('location');
  const [scrollProgress, setScrollProgress] = useState(0);
  const content = projectInfo;
  const stories = [{ id: 'location', label: t('home.tabLocation'), heading: content.location, description: content.locationDescription, marker: '01' }, { id: 'process', label: t('home.tabProcess'), heading: t('home.processHeading'), description: content.howWeWork.join(' '), marker: '02' }, { id: 'collaboration', label: t('home.tabPeople'), heading: t('project.collaborationTitle'), description: content.collaboration, marker: '03' }];
  const activeStory = stories.find((story) => story.id === activeId) ?? stories[0];
  const immersionProgress = Math.min(scrollProgress * 3.2, 1);
  const scrollToLifecycle = (event) => { event.preventDefault(); const target = document.getElementById('corales'); if (!target) return; const top = Math.max(target.getBoundingClientRect().top + window.scrollY + 180, 0); window.scrollTo({ top, behavior: 'smooth' }); };
  useEffect(() => { const updateDepth = () => setScrollProgress(Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1)); updateDepth(); window.addEventListener('scroll', updateDepth, { passive: true }); return () => window.removeEventListener('scroll', updateDepth); }, []);
  useEffect(() => { const items = [...document.querySelectorAll('.vh-reveal')]; const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false; if (reduce || !('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-visible')); return undefined; } const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.16 }); items.forEach((item) => observer.observe(item)); return () => observer.disconnect(); }, []);
  return <main className="velorah-home" style={{ '--vh-scroll': scrollProgress, '--vh-depth': immersionProgress, '--vh-underwater-image': `url(${descentBackground})` }}><div className={`vh-theme-background-night${isDark ? ' is-active' : ''}`} style={{ backgroundImage: `url(${descentNightBackground})` }} aria-hidden="true" /><div className="vh-water-atmosphere" aria-hidden="true" /><div className="vh-depth-meter" aria-hidden="true"><span className="vh-depth-meter__line"><i style={{ transform: `scaleY(${Math.max(scrollProgress, 0.08) })` }} /></span><span>{t('home.surface')}</span><span>{t('home.underwater')}</span></div>
    <section className="vh-hero" aria-labelledby="home-title"><div className="vh-hero__image" aria-hidden="true" /><div className="vh-hero__content"><p className="vh-kicker"><Waves size={15} /> {content.location}</p><h1 id="home-title">{t('home.title')}<br /><em>{t('home.titleEmphasis')}</em></h1><p className="vh-hero__intro">{t('home.intro')}</p><div className="vh-actions"><Link className="vh-button vh-button--light" to="/proyecto">{t('home.learnProject')} <ArrowRight size={16} /></Link><a className="vh-button vh-button--glass" href="#corales" onClick={scrollToLifecycle}>{t('home.viewLifecycle')}</a></div></div><button className="vh-scroll" type="button" onClick={() => document.getElementById('seguimiento')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })}><span>{t('home.explore')}</span><ArrowDown size={15} /></button></section>
    <section className="vh-statement vh-reveal" id="seguimiento"><h2>{t('home.statementTitle')}<br /><em>{t('home.statementEmphasis')}</em></h2><p>{content.collaboration}</p></section>
    <section className="vh-feature vh-reveal" aria-labelledby="feature-title"><div className="vh-feature__copy"><h2 id="feature-title">{t('home.featureTitle')}<br /><em>{t('home.featureEmphasis')}</em></h2><div className="vh-tabs" role="tablist" aria-label={t('home.tabsLabel')}>{stories.map((story) => <button key={story.id} type="button" role="tab" id={`tab-${story.id}`} aria-selected={story.id === activeId} aria-controls="story-panel" onClick={() => setActiveId(story.id)}>{story.label}</button>)}</div><div className="vh-story" id="story-panel" role="tabpanel" aria-labelledby={`tab-${activeStory.id}`}><span className="vh-story__marker">{activeStory.marker}</span><h3>{activeStory.heading}</h3><p>{activeStory.description}</p></div><div className="vh-feature__links"><Link className="vh-text-link" to="/proyecto">{t('home.workLink')} <ArrowRight size={16} /></Link><a className="vh-text-link vh-text-link--corals" href="#corales">{t('home.stagesLink')} <ArrowDown size={16} /></a></div></div><div className="vh-feature__visual" role="img" aria-label={t('home.illustrativeReef')}><div className="vh-visual__wash" /><Fish className="vh-visual__fish" size={34} aria-hidden="true" /></div></section>
    <CoralTimeline />
    <section className="vh-cta vh-reveal"><h2>{t('home.ctaTitle')}<br /><em>{t('home.ctaEmphasis')}</em></h2><p>{t('home.ctaText')}</p><Link className="vh-button vh-button--light" to="/proyecto">{t('home.restorationLink')} <ArrowRight size={16} /></Link></section>
    <section className="vh-home-video vh-reveal" aria-labelledby="home-video-title"><div className="vh-home-video__heading"><p className="vh-kicker"><Waves size={15} /> {t('home.videoLabel')}</p><h2 id="home-video-title">{t('home.videoTitle')}</h2></div><div className="vh-home-video__frame"><iframe src="https://www.youtube-nocookie.com/embed/Fn8Kjyc4EEU?rel=0" title={t('home.videoTitle')} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></section>
    <button className={`vh-back-top${scrollProgress > 0.22 ? ' is-visible' : ''}`} type="button" aria-label={t('common.backToTop')} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={16} /></button>
  </main>;
}
