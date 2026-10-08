import { AuthProvider } from '../components/auth/AuthProvider.jsx';
import { AppRoutes } from '../routes/AppRoutes.jsx';
import { NarratorProvider } from '../hooks/useNarrator.jsx';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget.jsx';
import { ThemeProvider } from '../components/theme/ThemeProvider.jsx';
import '../i18n/index.js';
import '../public-pages.css';
import '../styles.css';

export function App() {
  return <ThemeProvider><NarratorProvider><AuthProvider><AppRoutes /><ChatbotWidget /></AuthProvider></NarratorProvider></ThemeProvider>;
}
