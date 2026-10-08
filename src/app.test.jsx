import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicHome } from './pages/public/PublicHome.jsx';
import { InteractiveGallery } from './pages/public/InteractivePublicPages.jsx';

test('la portada muestra la restauración y cambia la información del proceso', () => {
  render(<MemoryRouter><PublicHome /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: /restauración coralina/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /ver el ciclo de vida/i })).toHaveAttribute('href', '#corales');
  expect(document.querySelector('iframe[src*="Fn8Kjyc4EEU"]')).toBeInTheDocument();
  expect(document.querySelector('.coral-storyline__visual-number')).not.toBeInTheDocument();
  expect(document.querySelector('.coral-storyline__active-copy')).not.toBeInTheDocument();

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

test('la galería conserva las fotografías y no muestra el carrusel del ciclo coralino', () => {
  const { container } = render(<MemoryRouter><InteractiveGallery /></MemoryRouter>);

  expect(container.querySelector('.coral-photo-gallery__grid').children).toHaveLength(55);
  expect(container.querySelector('.interactive-hero--gallery')).not.toBeInTheDocument();
  expect(screen.queryByText(/gameto/i)).not.toBeInTheDocument();
  expect(container.querySelector('.interactive-gallery--cards')).not.toBeInTheDocument();
  expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
});
