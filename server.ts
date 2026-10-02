import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Import API handlers directly from root /api
import tokenHandler from './api/onemap/token.ts';
import searchHandler from './api/onemap/search.ts';
import reverseGeocodeHandler from './api/onemap/reverse-geocode.ts';
import routeHandler from './api/onemap/route.ts';
import educationHandler from './api/onemap/education.ts';
import radiusHandler from './api/onemap/radius.ts';
import hdbResaleHandler from './api/hdb/resale.ts';
import healthHandler from './api/health.ts';
import uraTokenHandler from './api/ura/token.ts';
import uraTransactionsHandler from './api/ura/transactions.ts';
import uraCarparksHandler from './api/ura/carparks.ts';
import basemapHandler from './api/basemap.ts';

// Mount API routes
app.all('/api/health', (req, res) => healthHandler(req, res));
app.all('/api/onemap/token', (req, res) => tokenHandler(req, res));
app.all('/api/onemap/search', (req, res) => searchHandler(req, res));
app.all('/api/onemap/reverse-geocode', (req, res) => reverseGeocodeHandler(req, res));
app.all('/api/onemap/route', (req, res) => routeHandler(req, res));
app.all('/api/onemap/education', (req, res) => educationHandler(req, res));
app.all('/api/onemap/radius', (req, res) => radiusHandler(req, res));
app.all('/api/radius', (req, res) => radiusHandler(req, res));
app.all('/api/onemap/basemap', (req, res) => basemapHandler(req, res));
app.all('/api/basemap', (req, res) => basemapHandler(req, res));
app.all('/api/hdb/resale', (req, res) => hdbResaleHandler(req, res));

// URA Data Service routes
app.all('/api/ura/token', (req, res) => uraTokenHandler(req, res));
app.all('/api/ura/transactions', (req, res) => uraTransactionsHandler(req, res));
app.all('/api/ura/private-property', (req, res) => uraTransactionsHandler(req, res));
app.all('/api/private-property', (req, res) => uraTransactionsHandler(req, res));
app.all('/api/ura/carparks', (req, res) => uraCarparksHandler(req, res));

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite dev server middleware
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduHomes SG Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
