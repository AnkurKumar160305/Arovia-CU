import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import useScrollReveal from './hooks/useScrollReveal.js'

function AppWithEffects() {
  useScrollReveal();
  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithEffects />
  </StrictMode>,
)