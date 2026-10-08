import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { lifecycleAssets } from '../../services/lifecycleAssets.js';
import { lifecycleStages } from '../../services/projectData.js';

const clamp = (value) => Math.min(Math.max(value, 0), 1);

export function CoralTimeline() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const eventsRef = useRef(null);
  const horizontalDistanceRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [horizontalDistance, setHorizontalDistance] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = lifecycleStages[activeIndex] ?? lifecycleStages[0];

  useEffect(() => {
    const section = sectionRef.current;
    const events = eventsRef.current;
    if (!section || !events) return undefined;
    const measureHorizontalDistance = () => {
      const edgeInset = Number.parseFloat(window.getComputedStyle(events).left) || 24;
      const nextDistance = Math.max(0, events.scrollWidth - (window.innerWidth - edgeInset * 2));
      if (Math.abs(nextDistance - horizontalDistanceRef.current) > 1) {
        horizontalDistanceRef.current = nextDistance;
        setHorizontalDistance(nextDistance);
      }
    };
    measureHorizontalDistance();
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureHorizontalDistance);
    resizeObserver?.observe(events);
    window.addEventListener('resize', measureHorizontalDistance);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureHorizontalDistance);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const nextProgress = clamp(-rect.top / travel);
        setProgress(nextProgress);
        setActiveIndex(Math.min(lifecycleStages.length - 1, Math.round(nextProgress * (lifecycleStages.length - 1))));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [horizontalDistance]);

  const selectStage = (index) => {
    const target = sectionRef.current;
    if (!target) return;
    const travel = Math.max(target.offsetHeight - window.innerHeight, 1);
    const sectionTop = target.getBoundingClientRect().top + window.scrollY;
    const stageProgress = index / Math.max(lifecycleStages.length - 1, 1);
    window.scrollTo({ top: sectionTop + travel * stageProgress, behavior: 'smooth' });
  };

  const activeName = t(`lifecycle.${activeStage.id}.name`);
  const activeDescription = t(`lifecycle.${activeStage.id}.description`);

  return <section className="coral-storyline" id="corales" ref={sectionRef} aria-labelledby="coral-storyline-title" style={{ '--story-horizontal-distance': `${horizontalDistance}px`, '--story-horizontal-offset': `${-horizontalDistance * progress}px`, '--story-horizontal-progress': progress }}>
    <div className="coral-storyline__sticky">
      <div className="coral-storyline__canvas">
        <div className="coral-storyline__visual" aria-live="polite">
          <img key={activeStage.id} src={lifecycleAssets[activeStage.id]} alt={activeName} decoding="async" width="1254" height="1254" />
          <span className="coral-storyline__visual-label">{activeName}</span>
        </div>
        <div className="coral-storyline__heading">
          <p className="vh-kicker">{t('home.carouselLabel')}</p>
          <h2 id="coral-storyline-title">{t('home.reefTitle')}<br /><em>{t('home.reefEmphasis')}</em></h2>
          <p>{t('home.reefIntro')}</p>
        </div>
        <div className="coral-storyline__line-wrap" aria-hidden="true"><div className="coral-storyline__line"><i /><b /><span className="coral-storyline__line-dot coral-storyline__line-dot--start" /><span className="coral-storyline__line-dot coral-storyline__line-dot--end" /></div><small>{t('gallery.stage', { current: activeIndex + 1, total: lifecycleStages.length })}</small></div>
        <div className="coral-storyline__events" ref={eventsRef} role="tablist" aria-label={t('home.selectStage')}>
          {lifecycleStages.map((item, index) => {
            const name = t(`lifecycle.${item.id}.name`);
            const description = t(`lifecycle.${item.id}.description`);
            return <button className={`coral-storyline__event${activeIndex === index ? ' is-active' : ''}`} id={`coral-storyline-stage-${item.id}`} key={item.id} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="coral-storyline-title" onClick={() => selectStage(index)}>
              <span className="coral-storyline__event-dot">{String(index + 1).padStart(2, '0')}</span>
              <span className="coral-storyline__event-copy"><strong>{name}</strong><small>{description}</small></span>
            </button>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
