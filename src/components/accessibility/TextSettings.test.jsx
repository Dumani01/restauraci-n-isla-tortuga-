import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import '../../i18n/index.js';
import { TextSettings } from './TextSettings.jsx';

describe('TextSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty('--rc-font-scale');
    document.documentElement.style.removeProperty('font-size');
    document.documentElement.style.removeProperty('zoom');
    document.documentElement.removeAttribute('data-text-scale');
  });

  test('muestra el botón y mantiene el panel cerrado inicialmente', () => {
    render(<TextSettings />);

    expect(screen.getByRole('button', { name: /ajustes de texto/i })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  });

  test('despliega la barra de tamaño y muestra el valor actual', () => {
    render(<TextSettings />);

    fireEvent.click(screen.getByRole('button', { name: /ajustes de texto/i }));

    expect(screen.getByRole('slider')).toHaveValue('1');
    expect(screen.getByRole('status')).toHaveTextContent('100%');
  });

  test('aplica el porcentaje seleccionado y lo guarda localmente', () => {
    render(<TextSettings />);
    fireEvent.click(screen.getByRole('button', { name: /ajustes de texto/i }));

    fireEvent.change(screen.getByRole('slider'), { target: { value: '1.25' } });

    expect(screen.getByRole('status')).toHaveTextContent('125%');
    expect(document.documentElement.style.getPropertyValue('--rc-font-scale')).toBe('1.25');
    expect(document.documentElement.style.fontSize).toBe('20px');
    expect(document.documentElement.style.getPropertyValue('zoom')).toBe('');
    expect(localStorage.getItem('rc_text_scale')).toBe('1.25');
  });

  test('recupera una preferencia guardada y permite restablecerla', () => {
    localStorage.setItem('rc_text_scale', '1.15');
    render(<TextSettings />);
    fireEvent.click(screen.getByRole('button', { name: /ajustes de texto/i }));

    expect(screen.getByRole('status')).toHaveTextContent('115%');
    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));

    expect(screen.getByRole('status')).toHaveTextContent('100%');
    expect(document.documentElement.style.fontSize).toBe('16px');
    expect(localStorage.getItem('rc_text_scale')).toBe('1');
  });
});
