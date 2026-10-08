import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { PageIntro } from './PageIntro.jsx';

describe('PageIntro', () => {
  test('renderiza el título y el texto introductorio', () => {
    render(<PageIntro eyebrow="Proyecto" title="Cuidar el arrecife" number="01">Información de referencia</PageIntro>);

    expect(screen.getByRole('heading', { name: 'Cuidar el arrecife' })).toBeInTheDocument();
    expect(screen.getByText('Información de referencia')).toBeInTheDocument();
  });

  test('expone el identificador de sección y el número editorial', () => {
    const { container } = render(<PageIntro eyebrow="Mapa" title="Isla Tortuga" number="02">Zona general</PageIntro>);

    expect(container.querySelector('.public-page-hero')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('Mapa')).toBeInTheDocument();
  });
});
