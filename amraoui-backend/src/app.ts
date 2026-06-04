import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { NotFoundHandler } from './errors/NotFoundHandler';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

export const app: Application = express();

// ─── CORS ─────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://192.168.10.16:3000',
      // add your production domain(s) here
    ],
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
      auth:      '/api/v1/auth',
      admin:     '/api/v1/admin',
      drivers:   '/api/v1/drivers',
      customers: '/api/v1/customers',
    },
  });
});

// ─── Error Handling ────────────────────────────────────
app.use(globalErrorHandler);
app.use(NotFoundHandler.handle);
