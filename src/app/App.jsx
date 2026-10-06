import { AuthProvider } from '../components/auth/AuthProvider.jsx';
import { AppRoutes } from '../routes/AppRoutes.jsx';
import '../public-pages.css';
import '../styles.css';

export function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
