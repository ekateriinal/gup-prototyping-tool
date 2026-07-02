import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

import '@govom/components';
import '@govom/components/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
