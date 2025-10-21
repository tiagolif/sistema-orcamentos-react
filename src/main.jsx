import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider> {/* Wrap App with AuthProvider */}
        <ThemeProvider> {/* Wrap App with ThemeProvider */}
          <App />
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);