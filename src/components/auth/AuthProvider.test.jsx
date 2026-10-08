import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthProvider.jsx';
import { useAuth } from './AuthProvider.jsx';
import { PrivateRoute } from '../../routes/PrivateRoute.jsx';

function LoginState() {
  const { authError } = useAuth();
  return <p>Login {authError}</p>;
}

function renderPrivateRoute() {
  return render(<MemoryRouter initialEntries={['/private']}>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginState />} />
        <Route element={<PrivateRoute />}>
          <Route path="/private" element={<p>Private content</p>} />
        </Route>
      </Routes>
    </AuthProvider>
  </MemoryRouter>);
}

describe('demo authentication session validation', () => {
  beforeEach(() => localStorage.clear());

  test('rejects malformed session JSON and routes to login', () => {
    localStorage.setItem('rc_user', '{invalid');
    renderPrivateRoute();

    expect(screen.getByText('Login INVALID_SESSION')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });

  test('rejects a browser-edited role that does not match a known demo profile', () => {
    localStorage.setItem('rc_user', JSON.stringify({
      id: 'demo-user',
      email: 'visitante@restauracioncoralina.demo',
      name: 'Usuario demo',
      role: 'ADMIN',
      profile: 'Administrador',
    }));
    renderPrivateRoute();

    expect(screen.getByText('Login INVALID_SESSION')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });

  test('accepts a matching demo profile while identifying it as demo-only state', () => {
    localStorage.setItem('rc_user', JSON.stringify({
      id: 'demo-user',
      email: 'visitante@restauracioncoralina.demo',
      name: 'Visitante demo',
      role: 'USER',
      profile: 'Colaborador',
      demo: true,
    }));
    renderPrivateRoute();

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  test('reports unavailable browser storage separately from an invalid session', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function getItem(key) {
      if (key === 'rc_user') throw new Error('blocked');
      return originalGetItem.call(this, key);
    };
    try {
      renderPrivateRoute();
      expect(screen.getByText('Login AUTH_STORAGE_UNAVAILABLE')).toBeInTheDocument();
      expect(screen.queryByText('Private content')).not.toBeInTheDocument();
    } finally {
      Storage.prototype.getItem = originalGetItem;
    }
  });
});
