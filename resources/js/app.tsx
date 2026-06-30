import '../css/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//Providers
import { ToastProvider } from './shared/contexts/ToastContext';

// Pages
import Home from './pages/home';

const app = document.getElementById('app');
const queryClient = new QueryClient();

if (app) {
  const root = createRoot(app);

  root.render(
    <StrictMode>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ToastProvider>
    </StrictMode>
  );
}
