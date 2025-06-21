import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
    <ToastContainer/>
  </BrowserRouter>

)




