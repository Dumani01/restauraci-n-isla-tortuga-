import { ArrowRight, Camera, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RestorationMap } from '../../components/map/RestorationMap.jsx';
import { WeatherCard } from '../../components/weather/WeatherCard.jsx';
import { galleryPhotos as uploadedGalleryPhotos } from '../../services/galleryPhotos.js';
import { projectInfo } from '../../services/projectData.js';
import '../../interactive-public-pages.css';

export function InteractiveMapPage() {
  const { t } = useTranslation(); const content = projectInfo;
  return <main className="public-page interactive-page"><section className="interactive-hero"><div><p className="vh-kicker"><Waves size={15} /> {t('map.where')}</p><h1>{t('map.title')}<br /><em>{t('map.titleEmphasis')}</em></h1><p>{content.locationDescription}</p></div></section><section className="weather-section"><WeatherCard /></section><section className="public-content public-content--map interactive-map-layout"><RestorationMap /><div className="public-list"><div className="public-list__heading"><div><p className="vh-kicker">{t('map.restoration')}</p><h2>{t('map.what')}</h2></div><span>{t('map.process')}</span></div>{content.howWeWork.map((item, index) => <article className="public-record" key={item}><span className="public-record__code">0{index + 1}</span><span className="public-record__details"><b>{item}</b><small>{t('map.work')}</small></span></article>)}<Link className="vh-text-link" to="/proyecto">{t('map.complete')} <ArrowRight size={16} /></Link></div></section></main>;
}

export function InteractiveGallery() {
  const { t } = useTranslation();
  return <main className="public-page interactive-page">
    <section className="coral-photo-gallery" aria-labelledby="coral-photo-gallery-title">
      <header className="coral-photo-gallery__heading">
        <p className="vh-kicker"><Camera size={14} /> {t('gallery.photosLabel')}</p>
        <h2 id="coral-photo-gallery-title">{t('gallery.photosTitle')}</h2>
        <p>{t('gallery.photosIntro')}</p>
        <span>{t('gallery.photosCount', { count: uploadedGalleryPhotos.length })}</span>
      </header>
      <div className="coral-photo-gallery__grid">
        {uploadedGalleryPhotos.map((photo, index) => {
          const number = String(index + 1).padStart(2, '0');
          return <figure key={photo.id}>
            <a href={photo.src} target="_blank" rel="noreferrer">
              <img src={photo.src} alt={t('gallery.photoAlt', { number })} loading="lazy" decoding="async" />
            </a>
            <figcaption>{t('gallery.photoNumber', { number })}</figcaption>
          </figure>;
        })}
      </div>
    </section>
  </main>;
}
