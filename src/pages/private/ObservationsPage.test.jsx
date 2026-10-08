import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { ThemeProvider } from '../../components/theme/ThemeProvider.jsx';
import { ObservationsPage } from './ObservationsPage.jsx';

function renderPage() {
  return render(<MemoryRouter><ThemeProvider><ObservationsPage /></ThemeProvider></MemoryRouter>);
}

describe('ObservationsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.removeItem('rc_observations');
  });

  test('persists the observation and displays its saved fields', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/fragmento/i), { target: { value: 'Estructura A-01' } });
    fireEvent.change(screen.getByLabelText(/fecha/i), { target: { value: '2026-10-08' } });
    fireEvent.change(screen.getByLabelText(/actividad/i), { target: { value: 'monitoring' } });
    fireEvent.change(screen.getByLabelText(/responsable/i), { target: { value: 'Equipo de prueba' } });
    fireEvent.change(screen.getByLabelText(/notas/i), { target: { value: 'Observación local de prueba' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/guardado localmente/i);
    expect(screen.getByText('Estructura A-01')).toBeInTheDocument();
    expect(screen.getByText('Observación local de prueba')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('rc_observations'))).toHaveLength(1);
  });

  test('does not confirm success when storage writes fail', () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/fragmento/i), { target: { value: 'F-1' } });
    fireEvent.change(screen.getByLabelText(/fecha/i), { target: { value: '2026-10-08' } });
    fireEvent.change(screen.getByLabelText(/actividad/i), { target: { value: 'monitoring' } });
    fireEvent.change(screen.getByLabelText(/responsable/i), { target: { value: 'Equipo' } });
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'rc_observations') throw new Error('quota');
      return originalSetItem.call(this, key, value);
    };
    try {
      fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    } finally {
      Storage.prototype.setItem = originalSetItem;
    }
  });
});
