import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "@state/AuthContext.jsx";
import { AppProvider } from '@state/AppContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <AppProvider>
                <App />
            </AppProvider>
        </AuthProvider>
    </StrictMode>,
)
