import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicHome } from './PublicHome.jsx';

test('la portada muestra el hero y cambia las pestañas de seguimiento', () => {
  render(<MemoryRouter><PublicHome /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: /restauración coralina/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /explorar zonas/i })).toHaveAttribute('href', '/mapa');

  fireEvent.click(screen.getByRole('tab', { name: 'Observaciones' }));

  expect(screen.getByRole('tab', { name: 'Observaciones' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Una visita deja un registro trazable.');
});
