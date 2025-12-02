
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';


createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <PlayerProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </PlayerProvider>
  </AuthProvider>

);