import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { setupRoomHandlers } from './socket/roomHandler';
import questionRoutes from './routes/questionRoutes';
import { CoreGameStateManager } from './core/game/GameStateManager';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.set('trust proxy', 1);

  app.use(helmet({
    contentSecurityPolicy: false, // Vite uses inline scripts in dev
  }));
  app.use(compression());

  const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000'];

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.run.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10kb' }));

  app.use('/api/questions', questionRoutes);

  const server = http.createServer(app);
  
  const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket'],
});

  CoreGameStateManager.initialize(io);

  io.on('connection', (socket) => {
    // Basic socket connection logging (can be minimal for security)
    setupRoomHandlers(io, socket);

    socket.on('disconnect', () => {
      // Disconnect handled in room handlers
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Express Error]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
