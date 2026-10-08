import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PublicHome } from './pages/public/PublicHome.jsx';
import { InteractiveGallery } from './pages/public/InteractivePublicPages.jsx';
import { ProjectPage } from './pages/public/ProjectPage.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import { AuthProvider } from './components/auth/AuthProvider.jsx';
import { ThemeProvider } from './components/theme/ThemeProvider.jsx';
import { changeLanguage } from './i18n/index.js';

test('la portada muestra la restauración y cambia la información del proceso', () => {
  render(<MemoryRouter><PublicHome /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: /restauración coralina/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /ver el ciclo de vida/i })).toHaveAttribute('href', '#corales');
  expect(document.querySelector('iframe[src*="Fn8Kjyc4EEU"]')).toBeInTheDocument();
  expect(screen.getByLabelText('Video de restauración coralina')).toBeInTheDocument();
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

test('la galería abre las fotografías dentro de la página', () => {
  render(<MemoryRouter><InteractiveGallery /></MemoryRouter>);

  fireEvent.click(screen.getAllByRole('button', { name: /abrir imagen/i })[0]);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText(/imagen 1 de 55/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /imagen siguiente/i }));
  expect(screen.getByText(/imagen 2 de 55/i)).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('una ruta inexistente muestra una página 404 accesible y permite volver al inicio', async () => {
  localStorage.clear();
  render(<MemoryRouter initialEntries={['/ruta-inexistente']}><ThemeProvider><AuthProvider><AppRoutes /></AuthProvider></ThemeProvider></MemoryRouter>);

  expect(await screen.findByRole('heading', { name: /página no encontrada/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /volver al inicio/i })).toHaveAttribute('href', '/');
});

test('al cambiar el idioma se traducen textos procedentes de los datos del proyecto', async () => {
  const { unmount } = render(<MemoryRouter><ProjectPage /></MemoryRouter>);
  await changeLanguage('fr');
  await waitFor(() => expect(screen.getByText(/Dans cette zone/)).toBeInTheDocument());
  unmount();
  await changeLanguage('es');
});
