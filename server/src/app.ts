import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import goalRoutes from './modules/goal/goal.routes';
import taskRoutes from './modules/task/task.routes';
import plannerRoutes from './modules/planner/planner.routes';
import aiRoutes from './modules/ai/ai.routes';

const app = express();

// Middleware
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/ai', aiRoutes);

// Error handling (must be last)
app.use(errorMiddleware);

export default app;
