import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), { name: 'local-contact-api',
    async configureServer(server) {
      const { createContactHandler } = await import('./netlify/functions/lib/contact-handler');
      const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
      server.middlewares.use('/api/contact', async (req, res) => {
        try {
          let size = 0; const chunks: Buffer[] = [];
          for await (const part of req) { const chunk = Buffer.from(part); size += chunk.length; if (size > 16000) { res.writeHead(413, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'This inquiry is too large.' })); return; } chunks.push(chunk); }
          const base = `http://${req.headers.host || 'localhost:5173'}`;
          const headers = new Headers();
          Object.entries(req.headers).forEach(([k, v]) => { if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v); });
          const request = new Request(`${base}/api/contact`, { method: req.method, headers, ...(req.method !== 'GET' && req.method !== 'HEAD' ? { body: Buffer.concat(chunks).toString() } : {}) });
          const response = await createContactHandler(env)(request);
          res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(await response.text());
        } catch { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Local inquiry delivery is unavailable. Save a copy of your brief.' })); }
      });
    }
  }],
  build: { sourcemap: false, rollupOptions: { output: { manualChunks: isSsrBuild ? undefined : { motion: ['motion/react'], validation: ['zod'], framework: ['react', 'react-dom', 'react-router-dom'] } } } }
}));
