import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">CPL Manager</h1>
                <p className="text-gray-500">React + Tailwind CSS + Atomic Design Ready</p>
            </div>
        </div>
    );
}

if (document.getElementById('app')) {
    createRoot(document.getElementById('app')).render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
