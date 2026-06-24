import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Web components from @govom/components - statically imported so Vite bundles
// them locally and every gup-* class is registered exactly once at startup.
// (The autoloader entry pulls each component over HTTP from unpkg, which races
// with HMR and StrictMode and triggers duplicate-registration errors.)
import '@govom/components';
import '@govom/components/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
