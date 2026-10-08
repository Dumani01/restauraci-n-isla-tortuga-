import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { AuthProvider } from '../../components/auth/AuthProvider.jsx';
import { ThemeProvider } from '../../components/theme/ThemeProvider.jsx';
import { CoreDashboard } from './CoreDashboard.jsx';

function renderDashboard(role) {
  localStorage.setItem('rc_user', JSON.stringify({ id: `demo-${role.toLowerCase()}`, name: 'Usuario demo', role, profile: role }));
  return render(<MemoryRouter><ThemeProvider><AuthProvider><CoreDashboard /></AuthProvider></ThemeProvider></MemoryRouter>);
}

describe('CoreDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.removeItem('rc_registered_users');
  });

  test('muestra el panel de administración y el acceso al registro para ADMIN', () => {
    renderDashboard('ADMIN');

    expect(screen.getByRole('heading', { name: /panel de administraci/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /registrar usuario/i })).toHaveAttribute('href', '/admin/usuarios');
  });

  test('muestra el panel de coordinación sin acceso de administrador para MODERATOR', () => {
    renderDashboard('MODERATOR');

    expect(screen.getByRole('heading', { name: /panel de coordinaci/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /registro de trabajo/i })).toHaveAttribute('href', '/observaciones');
    expect(screen.queryByRole('link', { name: /registrar usuario/i })).not.toBeInTheDocument();
  });

  test('muestra el panel de colaborador para USER', () => {
    renderDashboard('USER');

    expect(screen.getByRole('heading', { name: /panel de colaborador/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /galer/i })).toHaveAttribute('href', '/galeria');
    expect(screen.queryByRole('link', { name: /registrar usuario/i })).not.toBeInTheDocument();
  });
});
