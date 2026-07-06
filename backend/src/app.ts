import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { logger } from './utils/logger';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './swagger/swagger';
import routes from './routes';

const app = express();

app.set('trust proxy', true);

// ─────────────────────────────────────────────
// Security Middlewares
// ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      env.FRONTEND_URL,
      // allow Vercel and Render preview deployments
      /\.vercel\.app$/,
      /\.onrender\.com$/,
      /localhost:\d+$/,
    ];
    if (!origin) return callback(null, true); // server-to-server / curl
    const ok = allowed.some((a) =>
      typeof a === 'string' ? a === origin : a.test(origin)
    );
    callback(ok ? null : new Error('CORS: origin not allowed'), ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
}));

// ─────────────────────────────────────────────
// Body Parsing
// ─────────────────────────────────────────────
// Raw body needed for webhook signature verification
app.use('/api/v1/orders/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ─────────────────────────────────────────────
// Logging
// ─────────────────────────────────────────────
if (!env.IS_TEST) {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  }));
}

// ─────────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────────
app.use(globalRateLimiter);

// ─────────────────────────────────────────────
// Static Files
// ─────────────────────────────────────────────
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

// ─────────────────────────────────────────────
// Swagger Docs
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Aayug Organics API Docs',
  customCss: '.swagger-ui .topbar { background-color: #1b4332; }',
}));

app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use(env.API_PREFIX, routes);

// ─────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
