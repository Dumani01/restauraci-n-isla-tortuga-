import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { AuthProvider } from '../auth/AuthProvider.jsx';
import { ChatbotWidget } from './ChatbotWidget.jsx';

function renderWidget() {
  return render(<MemoryRouter><AuthProvider><ChatbotWidget /></AuthProvider></MemoryRouter>);
}

describe('ChatbotWidget', () => {
  beforeEach(() => sessionStorage.clear());

  test('muestra el lanzador con icono de pez y mantiene su nombre accesible', () => {
    const { container } = renderWidget();
    const launcher = screen.getByRole('button', { name: /abrir asistente/i });

    expect(launcher).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelector('.fish-launcher__icon')).toBeInTheDocument();
    expect(container.querySelectorAll('.fish-launcher__bubble')).toHaveLength(3);
  });

  test('conserva la función de abrir y cerrar el asistente', () => {
    renderWidget();
    const launcher = screen.getByRole('button', { name: /abrir asistente/i });

    fireEvent.click(launcher);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(launcher).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getAllByRole('button', { name: /cerrar asistente/i })[1]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
