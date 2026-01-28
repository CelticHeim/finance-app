import '../css/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Providers
import { ToastProvider } from './contexts/ToastContext';

// Pages
import Home from './pages/home';

const app = document.getElementById('app');

if (app) {
    const root = createRoot(app);

    root.render(
        <StrictMode>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </StrictMode>
    );
}
