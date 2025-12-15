import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CitationProvider } from './components/CitationContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <CitationProvider>
      <App />
    </CitationProvider>
  </React.StrictMode>
);
