import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import './i18n'; 

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
      <BrowserRouter>
      <App />
    </BrowserRouter>
</HelmetProvider>
);
