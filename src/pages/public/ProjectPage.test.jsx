import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n/index.js';
import { ProjectPage } from './ProjectPage.jsx';

describe('ProjectPage', () => {
  test('muestra la ubicación y el propósito de restauración', () => {
    render(<MemoryRouter><ProjectPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /isla tortuga/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /por qué restaurar/i })).toBeInTheDocument();
  });

  test('presenta las tres áreas de trabajo del proyecto', () => {
    render(<MemoryRouter><ProjectPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /cómo lo hacemos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /un trabajo entre muchas personas/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
