import { Waves } from 'lucide-react';
import { PageIntro } from '../../components/public/PageIntro.jsx';
import { projectInfo } from '../../services/projectData.js';

export function ProjectPage() {
  return <main className="public-page"><PageIntro eyebrow="Restauración coralina · Carolina" title={<>Cuidar el arrecife para<br /><em>recuperar el ecosistema.</em></>} number="Proyecto">Un trabajo entre muchas personas para conocer, cuidar y recuperar los corales de Isla Tortuga y el Golfo de Nicoya.</PageIntro><section className="public-content public-content--split"><div className="public-content__heading"><p className="vh-kicker"><Waves size={15} /> ¿Dónde trabajamos?</p><h2>{projectInfo.location}</h2></div><div className="public-content__body"><p>{projectInfo.locationDescription}</p></div></section><section className="public-principles"><article><h2>¿Cómo lo hacemos?</h2><ul>{projectInfo.howWeWork.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h2>¿Por qué restaurar?</h2><p>{projectInfo.whyRestore}</p></article><article><h2>Un trabajo entre muchas personas</h2><p>{projectInfo.collaboration}</p></article></section></main>;
}
