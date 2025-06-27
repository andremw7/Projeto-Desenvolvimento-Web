
// Ponto de entrada da aplicação React, que renderiza o componente principal App.
// React application entry point that renders the main App component.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
