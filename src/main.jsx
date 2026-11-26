import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Lienzo component CSS (keyframes / non-Tailwind rules from the built bundle)
import '@jppinedo/lienzo/style.css'
import App from './App.jsx'
import { AuthProvider } from "@state/AuthContext.jsx";
import { AppProvider } from '@state/AppContext';
import { SearchProvider } from '@state/SearchContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <AppProvider>
                <SearchProvider>
                    <App />
                </SearchProvider>
            </AppProvider>
        </AuthProvider>
    </StrictMode>,
)
