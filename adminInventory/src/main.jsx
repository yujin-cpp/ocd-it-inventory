import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { InventoryProvider } from './context/InventoryContext'
import './index.css'
import { ThemeProvider } from "./context/ThemeContext"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <InventoryProvider>
        <ThemeProvider>
    <App />
  </ThemeProvider>
      </InventoryProvider>
    </BrowserRouter>
  </React.StrictMode>
)
