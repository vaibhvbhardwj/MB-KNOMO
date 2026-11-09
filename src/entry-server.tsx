import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App, { metadata } from './App';
export function render(path: string) { return { html: renderToString(<StaticRouter location={path}><App /></StaticRouter>), meta: metadata[path] }; }
