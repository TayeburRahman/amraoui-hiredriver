import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { NotFoundHandler } from './errors/NotFoundHandler';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

export const app: Application = express();

// ─── CORS ─────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedProduction = [
        'http://localhost:3000',
        'http://10.10.20.50:3000',
        'http://10.10.20.50:3001',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://192.168.10.16:3000',
        'https://amraoui-hiredriver.vercel.app'
      ];

      if (allowedProduction.includes(origin)) {
        return callback(null, true);
      }

      // Dev: allow Flutter web, Next.js, and LAN origins
      if (isDev) {
        const devAllowed =
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
          /^https?:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
          /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin);
        if (devAllowed) return callback(null, true);
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ─── Body Parsers ─────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ─── Static Files ─────────────────────────────────────
app.use(express.static('uploads'));

// ─── API Routes ───────────────────────────────────────
app.use('/api/v1', routes);

// ─── Health Check ─────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Amraoui HireDriver API is running ✅',
    version: 'v1',
    endpoints: {
      auth: '/api/v1/auth',
      admin: '/api/v1/admin',
      drivers: '/api/v1/drivers',
      customers: '/api/v1/customers',
    },
  });
});

// ─── Error Handling ────────────────────────────────────
app.use(globalErrorHandler);
app.use(NotFoundHandler.handle);
