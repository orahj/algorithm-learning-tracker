import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { AuthProvider } from './state/AuthProvider';
import { TrackerProvider } from './state/TrackerProvider';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <TrackerProvider>
      <App />
    </TrackerProvider>
  </AuthProvider>
);
