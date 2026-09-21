import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS Design System & Page Stylesheets
import './styles/variables.css';
import './styles/globals.css';
import './styles/landing.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/assessment.css';
import './styles/result.css';
import './styles/history.css';
import './styles/profile.css';
import './styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
