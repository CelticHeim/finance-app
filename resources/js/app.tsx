import '../css/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importar páginas
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Examples from './pages/Examples';
import NotFound from './pages/NotFound';

const app = document.getElementById('app');

if (app) {
    const root = createRoot(app);
    
    root.render(
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/examples" element={<Examples />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </StrictMode>
    );
}
