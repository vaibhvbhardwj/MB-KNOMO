import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/icons.css';
import './styles/main.css';
import './styles/branding.css';
import './styles/motion.css';
import './styles/refinements.css';
createRoot(document.getElementById('root')!).render(<BrowserRouter><App /></BrowserRouter>);
