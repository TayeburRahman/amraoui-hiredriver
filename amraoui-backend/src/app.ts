import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { NotFoundHandler } from './errors/NotFoundHandler';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config/index';

export const app: Application = express();

// ─── CORS ─────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';
app.use((req, res, next) => { res.setHeader("Vary", "Origin"); next(); });

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);


      const isAllowed =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /^https?:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
        /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
        origin === "https://amraoui-hiredriver-admin.vercel.app" ||
        origin === "https://amraoui-hiredriver.vercel.app";

      if (isAllowed) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ─── Ensure DB Connection for Serverless ──────────────
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(config.database_url as string, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      console.log('DB Reconnected in Serverless Middleware');
    } catch (error) {
      console.error('Failed to reconnect to DB:', error);
    }
  }
  next();
});

// ─── Body Parsers ─────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ─── Static Files ─────────────────────────── 
app.use(express.static('uploads'));

// ─── API Routes ───────────────────────────── 
app.use('/api/v1', routes);

// ─── Health Check ────────────────────────── 
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Vehiqqo HireDriver API is running ✅',
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
