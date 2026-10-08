import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { NewsPage } from './NewsPage.jsx';

describe('NewsPage', () => {
  test('muestra el encabezado informativo de noticias', () => {
    render(<MemoryRouter><NewsPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /conocer para/i })).toBeInTheDocument();
    expect(screen.getByText(/información/i)).toBeInTheDocument();
  });

  test('incluye las dos tarjetas principales de contenido', () => {
    render(<MemoryRouter><NewsPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /recuperar un arrecife requiere colaboración/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /un ecosistema que protege la vida/i })).toBeInTheDocument();
    expect(document.querySelectorAll('.public-news article')).toHaveLength(2);
  });
});
