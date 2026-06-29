/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { app } from './app';
import config from './config/index';
import { errorLogger, logger } from './shared/logger';
import socket from './socket/socket';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  if (!process.env.VERCEL) process.exit(1);
});

let server: any;
let isConnected = false;

async function main() {
  try {
    if (!isConnected || mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.database_url as string, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      logger.info('DB Connected Successfully');
    }

    if (!process.env.VERCEL) {
      const port =
        typeof config.port === 'number' ? config.port : Number(config.port);
      server = app.listen(port, config.base_url as string, () => {
        logger.info(`Example app listening on http://${config.base_url}:${config.port}`);
      });

      const socketIO = new Server(server, {
        pingTimeout: 60000,
        cors: {
          origin: '*',
        },
      });

      socket(socketIO);

      //@ts-ignore
      global.io = socketIO;
    }
  } catch (error) {
    errorLogger.error(error);
    if (!process.env.VERCEL) throw error;
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        if (!process.env.VERCEL) process.exit(1);
      });
    } else {
      if (!process.env.VERCEL) process.exit(1);
    }
  });
}

main().catch(err => errorLogger.error(err));

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});

export default app;
