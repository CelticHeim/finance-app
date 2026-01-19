import '../css/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importar páginas y providers
import Home from './pages/home/Home';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

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
                    <ToastContainer />
                </BrowserRouter>
            </ToastProvider>
        </StrictMode>
    );
}
