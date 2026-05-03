/**
 * main.jsx
 * 
 * WHY THIS EXISTS:
 * This is the React 18 application entry point. It binds the React component tree 
 * to the DOM (`#root`). We wrap the App in `<React.StrictMode>` intentionally to 
 * catch legacy API usage, unsafe lifecycles, and side-effect anomalies during 
 * development, ensuring high code quality and strict adherence to React standards.
 */
import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
