import '../css/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importar páginas
import Home from './pages/home/Home';

const app = document.getElementById('app');

if (app) {
    const root = createRoot(app);
    
    root.render(
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </StrictMode>
    );
}
