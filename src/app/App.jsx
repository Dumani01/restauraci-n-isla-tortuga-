import { AuthProvider } from '../components/auth/AuthProvider.jsx';
import { AppRoutes } from '../routes/AppRoutes.jsx';
import { NarratorProvider } from '../hooks/useNarrator.jsx';
import '../i18n/index.js';
import '../public-pages.css';
import '../styles.css';

export function App() {
  return <NarratorProvider><AuthProvider><AppRoutes /></AuthProvider></NarratorProvider>;
}
