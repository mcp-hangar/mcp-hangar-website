import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Pricing from './Pricing.tsx'
import Waitlist from './Waitlist.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/plans" element={<Pricing/>}/>
                    <Route path="/waitlist" element={<Waitlist/>}/>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>,
)
