
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppWrapper } from './components/app/AppWrapper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// In React 19 native ESM environments, importing createRoot as a named export
// can sometimes fail depending on the CDN's bundling strategy. 
// Using the default export from react-dom/client is more reliable.
const root = (ReactDOM as any).createRoot ? (ReactDOM as any).createRoot(rootElement) : (ReactDOM as any).default.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>
);
