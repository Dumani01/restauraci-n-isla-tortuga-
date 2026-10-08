import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { AuthProvider } from '../../components/auth/AuthProvider.jsx';
import { LoginPage } from './LoginPage.jsx';

function renderLogin() {
  return render(<MemoryRouter initialEntries={['/login']}><AuthProvider><LoginPage /></AuthProvider></MemoryRouter>);
}

describe('LoginPage', () => {
  beforeEach(() => localStorage.clear());

  test('muestra los tres perfiles demo disponibles', () => {
    renderLogin();

    expect(screen.getByText('Accesos demo')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /usar perfil/i })).toHaveLength(3);
    expect(screen.getByText('admin@restauracioncoralina.demo')).toBeInTheDocument();
    expect(screen.getByText('DemoUser2026!')).toBeInTheDocument();
  });

  test('carga correo y contraseña al elegir un perfil demo', () => {
    renderLogin();

    fireEvent.click(screen.getAllByRole('button', { name: /usar perfil/i })[1]);

    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('coordinacion@restauracioncoralina.demo');
    expect(screen.getByLabelText(/contraseña/i)).toHaveValue('DemoCoord2026!');
  });

  test('autentica el perfil administrador desde el formulario', () => {
    renderLogin();
    fireEvent.click(screen.getAllByRole('button', { name: /usar perfil/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /entrar al seguimiento/i }));

    expect(JSON.parse(localStorage.getItem('rc_user'))).toMatchObject({ role: 'ADMIN', profile: 'Administrador', demo: true });
    expect(JSON.parse(localStorage.getItem('rc_user'))).not.toHaveProperty('password');
  });
});
