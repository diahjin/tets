import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import bleyRoutes from './routes/bleys.js';
import pieceRoutes from './routes/pieces.js';
import combatRoutes from './routes/combats.js';
import statsRoutes from './routes/stats.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const allowedOrigin = process.env.CLIENT_URL || true;
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'Bley Bley Arena API' }));
app.use('/api/auth', authRoutes);
app.use('/api/bleys', bleyRoutes);
app.use('/api/pieces', pieceRoutes);
app.use('/api/combats', combatRoutes);
app.use('/api/stats', statsRoutes);

const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Error interno' }); });
app.listen(process.env.PORT || 4000, () => console.log(`Arena lista en puerto ${process.env.PORT || 4000}`));
