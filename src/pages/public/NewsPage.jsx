import { Waves } from 'lucide-react';
import { projectInfo } from '../../services/projectData.js';
import { PageIntro } from '../../components/public/PageIntro.jsx';

export function NewsPage() {
  return <main className="public-page"><PageIntro eyebrow="Restauración coralina · Información" title={<>Conocer para<br /><em>cuidar mejor.</em></>} number="Información">La recuperación de un arrecife combina conocimiento, seguimiento y colaboración.</PageIntro><section className="public-news"><article className="public-news__feature"><p className="vh-kicker"><Waves size={15} /> Trabajo colectivo</p><h2>Recuperar un arrecife requiere colaboración</h2><p>{projectInfo.collaboration}</p></article><article className="public-news__event"><p className="vh-kicker"><Waves size={15} /> Importancia de los arrecifes</p><h2>Un ecosistema que protege la vida</h2><p>{projectInfo.whyRestore}</p></article></section></main>;
}
