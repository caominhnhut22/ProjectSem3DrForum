import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './Contexts/AuthProvider';
import App from './App';  
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

reportWebVitals();
