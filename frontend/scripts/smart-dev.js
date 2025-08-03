#!/usr/bin/env node

/**
 * Smart Dev Server
 * Automatically detects available port and updates configurations
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { execSync } = require('child_process');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Function to check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(port, (err) => {
      if (err) {
        resolve(false);
      } else {
        server.close(() => resolve(true));
      }
    });
    server.on('error', () => resolve(false));
  });
}

// Function to find available port
async function findAvailablePort(startPort = 3000) {
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available ports found');
}

async function startServer() {
  try {
    // Get port from environment or find available
    let port = process.env.PORT || 3000;
    
    // If PORT is specified, use it; otherwise find available
    if (!process.env.PORT) {
      port = await findAvailablePort(3000);
    }

    // Update environment configurations
    console.log(`🔍 Port: ${port}`);
    
    try {
      execSync(`node scripts/detect-port.js ${port}`, { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
    } catch (error) {
      console.warn('⚠️  Config update failed');
    }

    // Prepare Next.js app
    await app.prepare();

    // Create server
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    // Start server
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`🚀 Ready: http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
