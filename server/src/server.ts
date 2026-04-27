import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express server
  app.listen(env.port, () => {
    console.log(`
🚀 Planora Server running!
📡 Port: ${env.port}
🌍 Environment: ${env.nodeEnv}
🔗 URL: http://localhost:${env.port}
    `);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
