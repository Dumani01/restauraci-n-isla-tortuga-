import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicHome } from './pages/public/PublicHome.jsx';

test('la portada muestra la restauración y cambia la información del proceso', () => {
  render(<MemoryRouter><PublicHome /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: /restauración coralina/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /ver el ciclo de vida/i })).toHaveAttribute('href', '#corales');

  fireEvent.click(screen.getByRole('tab', { name: 'Cómo' }));

  expect(screen.getByRole('tab', { name: 'Cómo' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Restaurar requiere tiempo');
});

test('el scroll no añade decoración circular a la portada', () => {
  render(<MemoryRouter><PublicHome /></MemoryRouter>);

  expect(screen.queryByTestId('bubble-field')).not.toBeInTheDocument();
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 });
  fireEvent.scroll(window);

  expect(screen.queryByTestId('bubble-field')).not.toBeInTheDocument();
});
