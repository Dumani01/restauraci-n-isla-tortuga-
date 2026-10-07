import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageIntro } from '../../components/public/PageIntro.jsx';
import { useAuth } from '../../components/auth/AuthProvider.jsx';
import { projectInfo } from '../../services/projectData.js';

export function LoginPage() {
  const { t } = useTranslation(); const { user, login } = useAuth(); const navigate = useNavigate(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const content = projectInfo;
  if (user) return <Navigate to="/dashboard" replace />;
  return <main className="public-page public-page--login"><PageIntro eyebrow={t('login.eyebrow')} title={<>{t('login.title')}<br /><em>{t('login.titleEmphasis')}</em></>} number={t('nav.access')}>{t('login.intro')}</PageIntro><section className="public-login-wrap"><div className="public-login-context"><p className="vh-kicker">{t('login.contextKicker')}</p><h2>{content.location}<br /><em>{t('login.care')}</em></h2><p>{content.locationDescription}</p></div><form className="public-login-form" onSubmit={(event) => { event.preventDefault(); if (login(email, password)) navigate('/dashboard'); else setError(t('login.error')); }}><p className="vh-kicker">{t('login.private')}</p><h2>{t('login.heading')}</h2><label>{t('login.email')}<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>{t('login.password')}<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="public-login-error" role="alert">{error}</p>}<button className="vh-button vh-button--light" type="submit">{t('login.submit')} <ArrowRight size={16} /></button></form></section></main>;
}
