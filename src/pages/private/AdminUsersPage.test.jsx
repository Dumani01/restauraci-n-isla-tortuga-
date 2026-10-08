import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { AuthProvider } from '../../components/auth/AuthProvider.jsx';
import { ThemeProvider } from '../../components/theme/ThemeProvider.jsx';
import { findUserByCredentials } from '../../services/databaseService.js';
import { AdminUsersPage } from './AdminUsersPage.jsx';

function renderAdminPage(role = 'ADMIN') {
  localStorage.setItem('rc_user', JSON.stringify({ id: 'demo-admin', name: 'Administración demo', role, profile: 'Administrador' }));
  return render(<MemoryRouter><ThemeProvider><AuthProvider><AdminUsersPage /></AuthProvider></ThemeProvider></MemoryRouter>);
}

describe('AdminUsersPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.removeItem('rc_registered_users');
  });

  test('bloquea el módulo cuando la sesión no es ADMIN', () => {
    renderAdminPage('MODERATOR');

    expect(screen.queryByRole('heading', { name: /registrar usuario/i })).not.toBeInTheDocument();
  });

  test('registra un nuevo usuario y lo muestra en la lista', () => {
    renderAdminPage();
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Nuevo colaborador' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'nuevo@demo.local' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'NuevaClave2026!' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar usuario/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/usuario registrado/i);
    expect(screen.getByText('nuevo@demo.local')).toBeInTheDocument();
    expect(findUserByCredentials('nuevo@demo.local', 'NuevaClave2026!')).toMatchObject({ profile: 'Colaborador', demo: false });
  });

  test('rechaza correos duplicados', () => {
    renderAdminPage();
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Duplicado' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@restauracioncoralina.demo' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'NuevaClave2026!' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar usuario/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/ya existe/i);
  });
});
