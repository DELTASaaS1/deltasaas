import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Reset CSS global
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #F8FAFC; color: #0F172A; font-family: system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  a { color: inherit; }
  button, input, select, textarea { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #FFFFFF; }
  ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
