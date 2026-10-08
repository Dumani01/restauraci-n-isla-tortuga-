import { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RestorationMap } from '../../components/map/RestorationMap.jsx';
import { WeatherCard } from '../../components/weather/WeatherCard.jsx';
import { lifecycleAssets } from '../../services/lifecycleAssets.js';
import { lifecycleStages, projectInfo } from '../../services/projectData.js';
import galleryIsland from '../../assets/isla-tortuga-hero.png';
import galleryDescent from '../../assets/isla-tortuga-descent.png';
import galleryDescentExtended from '../../assets/isla-tortuga-descent-extended.png';
import galleryUnderwater from '../../assets/underwater-hero.png';
import galleryLongScroll from '../../assets/isla-tortuga-long-scroll.png';
import '../../interactive-public-pages.css';

export function InteractiveMapPage() {
  const { t } = useTranslation(); const content = projectInfo;
  return <main className="public-page interactive-page"><section className="interactive-hero"><div><p className="vh-kicker"><Waves size={15} /> {t('map.where')}</p><h1>{t('map.title')}<br /><em>{t('map.titleEmphasis')}</em></h1><p>{content.locationDescription}</p></div></section><section className="weather-section"><WeatherCard /></section><section className="public-content public-content--map interactive-map-layout"><RestorationMap /><div className="public-list"><div className="public-list__heading"><div><p className="vh-kicker">{t('map.restoration')}</p><h2>{t('map.what')}</h2></div><span>{t('map.process')}</span></div>{content.howWeWork.map((item, index) => <article className="public-record" key={item}><span className="public-record__code">0{index + 1}</span><span className="public-record__details"><b>{item}</b><small>{t('map.work')}</small></span></article>)}<Link className="vh-text-link" to="/proyecto">{t('map.complete')} <ArrowRight size={16} /></Link></div></section></main>;
}

export function InteractiveGallery() {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);
  const stage = lifecycleStages[activeImage] ?? lifecycleStages[0];
  const name = t(`lifecycle.${stage.id}.name`);
  const description = t(`lifecycle.${stage.id}.description`);
  const changeStage = (nextIndex) => setActiveImage((nextIndex + lifecycleStages.length) % lifecycleStages.length);
  const galleryPhotos = [galleryIsland, galleryDescent, galleryDescentExtended, galleryUnderwater, galleryLongScroll, galleryIsland];

  return <main className="public-page interactive-page"><section className="interactive-hero interactive-hero--gallery"><div><p className="vh-kicker"><Camera size={15} /> {t('gallery.kicker')}</p><h1>{t('gallery.title')}<br /><em>{t('gallery.titleEmphasis')}</em></h1><p>{t('gallery.intro')}</p></div></section><section className="interactive-gallery interactive-gallery--cards" aria-label={t('gallery.carousel')}><div className="coral-gallery__featured"><div className="coral-gallery__photo"><img src={galleryPhotos[activeImage]} alt={name} decoding="async" width="1254" height="1254" /><span className="coral-gallery__counter">{String(activeImage + 1).padStart(2, '0')} / {String(lifecycleStages.length).padStart(2, '0')}</span><span className="coral-gallery__badge">{t('gallery.reference')}</span></div><div className="coral-gallery__details" id="lifecycle-stage-panel" role="tabpanel" aria-labelledby={`lifecycle-stage-${stage.id}`}><p className="vh-kicker"><Camera size={14} /> {t('gallery.stage', { current: activeImage + 1, total: lifecycleStages.length })}</p><h2 id="lifecycle-stage-title">{name}</h2><p>{description}</p><span className="lifecycle-demo-note">{t('gallery.reference')}</span><div className="lifecycle-controls"><button type="button" aria-label={t('common.previous')} onClick={() => changeStage(activeImage - 1)}><ArrowLeft size={16} /></button><button type="button" aria-label={t('common.next')} onClick={() => changeStage(activeImage + 1)}><ArrowRight size={16} /></button></div></div></div><div className="coral-gallery__grid" role="tablist" aria-label={t('home.selectStage')}>{lifecycleStages.map((item, index) => { const itemName = t(`lifecycle.${item.id}.name`); return <button className={`coral-gallery-card${activeImage === index ? ' is-active' : ''}`} key={item.id} id={`lifecycle-stage-${item.id}`} type="button" role="tab" aria-selected={activeImage === index} aria-controls="lifecycle-stage-panel" onClick={() => setActiveImage(index)}><span className="coral-gallery-card__image"><img src={galleryPhotos[index]} alt="" aria-hidden="true" loading="lazy" width="1254" height="1254" /></span><span className="coral-gallery-card__text"><small>{String(index + 1).padStart(2, '0')}</small><strong>{itemName}</strong></span></button>; })}</div></section></main>;
}
