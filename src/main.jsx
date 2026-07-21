import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Handle Vite Chunk Load Errors (common during redeploys)
window.addEventListener('error', e => {
  if (e.message && (e.message.includes('Failed to fetch dynamically imported module') ||
    e.message.includes('Importing a prevented MIME type'))) {
    window.location.reload();
  }
}, true);

window.addEventListener('vite:preloadError', (event) => {
  window.location.reload(); // Force reload to get the latest manifest
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
