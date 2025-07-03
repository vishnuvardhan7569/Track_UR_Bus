import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Note the `/client` here
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './responsive.css';
import './main.css';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render using createRoot
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
