import app from './app.js';
import { connectDB } from './config/database.js';
import { config } from './config/config.js';

/**
 * Server Entry Point
 * Connects to database and starts the Express server
 */

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`
🚀 Synapse Server is running!
📍 Environment: ${config.nodeEnv}
🌐 URL: http://localhost:${config.port}
📚 API Docs: http://localhost:${config.port}/api
🏥 Health Check: http://localhost:${config.port}/health
      `);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        
        try {
          // Close database connection
          const { disconnectDB } = await import('./config/database.js');
          await disconnectDB();
          console.log('🗄️  Database disconnected');
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown if graceful shutdown takes too long
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle process signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();