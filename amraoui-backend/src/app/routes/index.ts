import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { DriverRoutes } from '../modules/drivers/drivers.routes';
import { CustomerRoutes } from '../modules/customers/customers.routes';

import { RequestsRoutes } from '../modules/requests/requests.routes';
import { NotificationRoutes } from '../modules/notifications/notifications.routes';

const router = express.Router();

const moduleRoutes = [
  // ─── Authentication (register, login, OTP, password) ─────────
  { path: '/auth',      route: AuthRoutes     },
  // ─── Admin management (customers, admins, stats) ──────────────
  { path: '/admin',     route: AdminRoutes    },
  // ─── Driver management (approve/decline, location) ────────────
  { path: '/drivers',   route: DriverRoutes   },
  // ─── Customer self-service (profile, order history) ───────────
  { path: '/customers', route: CustomerRoutes },
  // ─── Requests / Missions ──────────────────────────────────────
  { path: '/requests',  route: RequestsRoutes },
  // ─── Notifications ────────────────────────────────────────────
  { path: '/notifications', route: NotificationRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
