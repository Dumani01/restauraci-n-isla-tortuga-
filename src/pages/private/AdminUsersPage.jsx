import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Moon, Sun, UserPlus } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../components/auth/AuthProvider.jsx';
import { useTheme } from '../../components/theme/ThemeProvider.jsx';
import { getUserRecords, registerUserRecord } from '../../services/databaseService.js';

const initialForm = { name: '', email: '', password: '', role: 'USER', profile: 'Colaborador', description: '' };

export function AdminUsersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState(() => getUserRecords());
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSaved(false);
  };

  const submit = (event) => {
    event.preventDefault();
    const result = registerUserRecord(form);
    if (!result.success) {
      setError(t('private.emailExists', 'Ya existe un usuario con ese correo.'));
      setSaved(false);
      return;
    }
    setUsers(getUserRecords());
    setForm(initialForm);
    setError('');
    setSaved(true);
  };

  return <section className={`admin-users-page${isDark ? ' admin-users-page--dark' : ''}`}>
    <header className="private-section-topbar">
      <Link className="private-section-back" to="/dashboard" aria-label={t('common.back', 'Volver')}><ArrowLeft size={18} /></Link>
      <strong>{t('private.userManagement', 'Gestión de usuarios')}</strong>
      <div className="private-section-actions">
        <button className="private-section-theme-toggle" type="button" aria-label={isDark ? t('common.lightTheme') : t('common.darkTheme')} aria-pressed={isDark} onClick={toggleTheme}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
      </div>
    </header>
    <div className="admin-users-page__content">
      <p className="eyebrow">{t('private.adminModule', 'Módulo de administración')}</p>
      <h1>{t('private.registerUser', 'Registrar usuario')}</h1>
      <p className="admin-users-page__intro">{t('private.registerUserIntro', 'Crea accesos demo para revisar los distintos perfiles del sistema. Estos registros se guardan localmente en este navegador.')}</p>
      <div className="admin-users-page__grid">
        <form className="panel form admin-user-form" onSubmit={submit}>
          <label>{t('private.userName', 'Nombre')}<input name="name" value={form.name} onChange={updateField} required /></label>
          <label>{t('login.email', 'Correo electrónico')}<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
          <label>{t('login.password', 'Contraseña')}<input name="password" type="password" minLength="8" value={form.password} onChange={updateField} required /></label>
          <label>{t('private.profile', 'Perfil')}<select name="role" value={form.role} onChange={(event) => { const value = event.target.value; setForm((current) => ({ ...current, role: value, profile: value === 'ADMIN' ? 'Administrador' : value === 'MODERATOR' ? 'Coordinador' : 'Colaborador' })); }}><option value="ADMIN">ADMIN · Administrador</option><option value="MODERATOR">MODERATOR · Coordinador</option><option value="USER">USER · Colaborador</option></select></label>
          <label className="full">{t('private.description', 'Descripción')}<textarea name="description" value={form.description} onChange={updateField} /></label>
          {error && <p className="admin-users-page__error full" role="alert">{error}</p>}
          {saved && <p className="admin-users-page__success full" role="status"><CheckCircle2 size={16} />{t('private.userSaved', 'Usuario registrado correctamente.')}</p>}
          <button className="button full" type="submit"><UserPlus size={16} />{t('private.saveUser', 'Guardar usuario')}</button>
        </form>
        <section className="panel admin-users-list" aria-labelledby="registered-users-title">
          <div className="admin-users-list__header"><div><p className="eyebrow">{t('private.userList', 'Usuarios')}</p><h2 id="registered-users-title">{users.length}</h2></div><small>{t('common.demo', 'Datos de referencia')}</small></div>
          <div className="admin-users-list__items">{users.map((record) => <article key={record.id}><div><strong>{record.name}</strong><span>{record.email}</span></div><b>{record.profile || record.role}</b></article>)}</div>
        </section>
      </div>
    </div>
  </section>;
}
