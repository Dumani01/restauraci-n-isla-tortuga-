import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';
import '../../i18n/index.js';
import { CoralRegistry } from './CoralRegistry.jsx';

describe('CoralRegistry', () => {
  beforeEach(() => localStorage.clear());

  test('counts registrations by recorded status and life stage, and updates counts when edited or deleted', () => {
    render(<CoralRegistry />);

    expect(screen.getByTestId('coral-count-sick')).toHaveTextContent('0');
    expect(screen.getByTestId('coral-count-healthy')).toHaveTextContent('0');
    expect(screen.getByTestId('coral-count-treatment')).toHaveTextContent('0');
    expect(screen.getByTestId('coral-count-juvenile')).toHaveTextContent('0');
    expect(screen.getByTestId('coral-count-adult')).toHaveTextContent('0');

    fireEvent.change(screen.getByLabelText('Identificador único'), { target: { value: 'C-101' } });
    fireEvent.change(screen.getByLabelText('Estado registrado'), { target: { value: 'sick' } });
    fireEvent.change(screen.getByLabelText('Etapa de vida'), { target: { value: 'adult' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByTestId('coral-count-sick')).toHaveTextContent('1');
    expect(screen.getByTestId('coral-count-adult')).toHaveTextContent('1');
    expect(screen.getByText('C-101')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar C-101' }));
    fireEvent.change(screen.getByLabelText('Estado registrado'), { target: { value: 'treatment' } });
    fireEvent.change(screen.getByLabelText('Etapa de vida'), { target: { value: 'juvenile' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(screen.getByTestId('coral-count-sick')).toHaveTextContent('0');
    expect(screen.getByTestId('coral-count-treatment')).toHaveTextContent('1');
    expect(screen.getByTestId('coral-count-juvenile')).toHaveTextContent('1');
    expect(screen.getByTestId('coral-count-adult')).toHaveTextContent('0');

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar C-101' }));
    expect(screen.getByTestId('coral-count-treatment')).toHaveTextContent('0');
    expect(screen.queryByText('C-101')).not.toBeInTheDocument();
  }, 15000);

  test('does not overwrite or enable editing when stored data is malformed', () => {
    localStorage.setItem('rc_coral_registry', '{broken');

    render(<CoralRegistry />);

    expect(screen.getByRole('alert')).toHaveTextContent('Los registros guardados tienen un formato inválido.');
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeDisabled();
    expect(localStorage.getItem('rc_coral_registry')).toBe('{broken');
  });
});
