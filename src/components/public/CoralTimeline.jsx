import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { lifecycleAssets } from '../../services/lifecycleAssets.js';
import { lifecycleStages } from '../../services/projectData.js';

export function CoralTimeline() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = lifecycleStages[activeIndex] ?? lifecycleStages[0];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const nextProgress = Math.min(Math.max(-rect.top / travel, 0), 1);
        setProgress(nextProgress);
        setActiveIndex(Math.min(lifecycleStages.length - 1, Math.round(nextProgress * (lifecycleStages.length - 1))));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);

  const selectStage = (index) => {
    const target = sectionRef.current;
    if (!target) return;
    const travel = Math.max(target.offsetHeight - window.innerHeight, 1);
    const sectionTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + travel * (index / Math.max(lifecycleStages.length - 1, 1)), behavior: 'smooth' });
  };

  const offset = -(progress * 58);
  const activeName = t(`lifecycle.${activeStage.id}.name`);
  const activeDescription = t(`lifecycle.${activeStage.id}.description`);

  return <section className="coral-reference-timeline" id="corales" ref={sectionRef} aria-labelledby="coral-timeline-title"><div className="coral-reference-timeline__sticky"><div className="coral-reference-timeline__slider" ref={sliderRef} style={{ transform: `translate3d(${offset}%, 0, 0)` }}><div className="coral-reference-timeline__feature"><img src={lifecycleAssets[activeStage.id]} alt={activeName} decoding="async" width="1254" height="1254" /><span className="coral-reference-timeline__feature-label">{activeName}</span></div><div className="coral-reference-timeline__journey"><div className="coral-reference-timeline__heading"><p className="vh-kicker">{t('home.carouselLabel')}</p><h2 id="coral-timeline-title">{t('home.reefTitle')}<br /><em>{t('home.reefEmphasis')}</em></h2><p>{t('home.reefIntro')}</p></div><div className="coral-reference-timeline__axis" aria-hidden="true"><i /><b style={{ width: `${progress * 100}%` }} /></div><div className="coral-reference-timeline__events" role="tablist" aria-label={t('home.selectStage')}>{lifecycleStages.map((item, index) => { const name = t(`lifecycle.${item.id}.name`); const description = t(`lifecycle.${item.id}.description`); const top = index % 2 === 0; return <button className={`coral-reference-timeline__event${activeIndex === index ? ' is-active' : ''}${top ? ' is-top' : ' is-bottom'}`} id={`coral-stage-${item.id}`} key={item.id} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="coral-timeline-panel" onClick={() => { setActiveIndex(index); selectStage(index); }}><span className="coral-reference-timeline__dot">{String(index + 1).padStart(2, '0')}</span><span className="coral-reference-timeline__event-copy"><strong>{name}</strong><small>{description}</small></span></button>; })}</div><div className="coral-reference-timeline__period">{t('gallery.stage', { current: activeIndex + 1, total: lifecycleStages.length })}</div><div className="coral-reference-timeline__active-copy" id="coral-timeline-panel" aria-live="polite"><strong>{activeName}</strong><p>{activeDescription}</p></div></div></div><div className="coral-reference-timeline__controls"><button type="button" aria-label={t('common.previous')} onClick={() => selectStage((activeIndex - 1 + lifecycleStages.length) % lifecycleStages.length)}><ArrowLeft size={16} /></button><button type="button" aria-label={t('common.next')} onClick={() => selectStage((activeIndex + 1) % lifecycleStages.length)}><ArrowRight size={16} /></button></div></div></section>;
}
