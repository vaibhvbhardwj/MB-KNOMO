import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/icons.css';
import './styles/main.css';
createRoot(document.getElementById('root')!).render(<BrowserRouter><App /></BrowserRouter>);
