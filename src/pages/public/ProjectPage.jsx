import { Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '../../components/public/PageIntro.jsx';
import { projectInfo } from '../../services/projectData.js';

export function ProjectPage() {
  const { t } = useTranslation(); const content = projectInfo;
  return <main className="public-page"><PageIntro eyebrow={t('project.eyebrow')} title={<>{t('project.title')}<br /><em>{t('project.titleEmphasis')}</em></>} number={t('nav.project')}>{t('project.intro')}</PageIntro><section className="public-content public-content--split"><div className="public-content__heading"><p className="vh-kicker"><Waves size={15} /> {t('project.where')}</p><h2>{content.location}</h2></div><div className="public-content__body"><p>{content.locationDescription}</p></div></section><section className="public-principles"><article><h2>{t('project.how')}</h2><ul>{content.howWeWork.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h2>{t('project.why')}</h2><p>{content.whyRestore}</p></article><article><h2>{t('project.collaborationTitle')}</h2><p>{content.collaboration}</p></article></section></main>;
}
