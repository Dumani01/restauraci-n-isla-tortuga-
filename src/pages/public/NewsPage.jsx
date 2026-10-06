import { Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '../../components/public/PageIntro.jsx';

export function NewsPage() {
  const { t } = useTranslation(); const content = t('content', { returnObjects: true });
  return <main className="public-page"><PageIntro eyebrow={t('news.eyebrow')} title={<>{t('news.title')}<br /><em>{t('news.titleEmphasis')}</em></>} number={t('nav.news')}>{t('news.intro')}</PageIntro><section className="public-news"><article className="public-news__feature"><p className="vh-kicker"><Waves size={15} /> {t('news.collective')}</p><h2>{t('news.featureTitle')}</h2><p>{content.collaboration}</p></article><article className="public-news__event"><p className="vh-kicker"><Waves size={15} /> {t('news.importance')}</p><h2>{t('news.ecosystemTitle')}</h2><p>{content.whyRestore}</p></article></section></main>;
}
