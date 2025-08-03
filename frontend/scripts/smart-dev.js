#!/usr/bin/env node

// Simple dev script that just runs next dev
const { spawn } = require('child_process');

console.log('🚀 Starting Next.js development server...');

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Error starting Next.js:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Next.js development server exited with code ${code}`);
  process.exit(code);
});
