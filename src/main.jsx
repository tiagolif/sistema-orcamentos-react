import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider> {/* Wrap App with ThemeProvider */}
        <App />
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
);