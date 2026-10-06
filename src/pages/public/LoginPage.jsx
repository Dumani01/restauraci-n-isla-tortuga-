import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageIntro } from '../../components/public/PageIntro.jsx';
import { useAuth } from '../../components/auth/AuthProvider.jsx';
import { projectInfo } from '../../services/projectData.js';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (user) return <Navigate to="/dashboard" replace />;
  return <main className="public-page public-page--login"><PageIntro eyebrow="Acceso · Área de trabajo" title={<>Un espacio para<br /><em>los registros.</em></>} number="Acceso">El área privada permite registrar actividades de restauración y organizar información del proyecto.</PageIntro><section className="public-login-wrap"><div className="public-login-context"><p className="vh-kicker">Restauración coralina</p><h2>{projectInfo.location}<br /><em>con cuidado.</em></h2><p>{projectInfo.locationDescription}</p></div><form className="public-login-form" onSubmit={(event) => { event.preventDefault(); if (login(email, password)) navigate('/dashboard'); else setError('Acceso no configurado o credenciales incorrectas'); }}><p className="vh-kicker">Acceso privado</p><h2>Iniciar sesión</h2><label>Correo electrónico<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Contraseña<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="public-login-error" role="alert">{error}</p>}<button className="vh-button vh-button--light" type="submit">Entrar al seguimiento <ArrowRight size={16} /></button></form></section></main>;
}
