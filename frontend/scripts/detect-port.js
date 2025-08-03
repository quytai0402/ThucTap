#!/usr/bin/env node

/**
 * Port Detection Utility
 * Automatically detects the current port and updates environment configurations
 */

const fs = require('fs');
const path = require('path');

// Get current port from command line arguments or environment
const port = process.argv[2] || process.env.PORT || '3000';

// Define paths
const backendEnvPath = path.join(__dirname, '../../backend/.env');
const frontendEnvPath = path.join(__dirname, '../.env.local');

// Function to update or create env file
function updateEnvFile(filePath, key, value) {
  let envContent = '';
  
  // Read existing content if file exists
  if (fs.existsSync(filePath)) {
    envContent = fs.readFileSync(filePath, 'utf8');
  }

  // Check if key already exists
  const keyRegex = new RegExp(`^${key}=.*$`, 'm');
  const newLine = `${key}=${value}`;

  if (keyRegex.test(envContent)) {
    // Update existing key
    envContent = envContent.replace(keyRegex, newLine);
  } else {
    // Add new key
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += newLine + '\n';
  }

  // Write back to file
  fs.writeFileSync(filePath, envContent);
  // Silent update - no console output
}

// Update frontend URL in backend env
const frontendUrl = `http://localhost:${port}`;
updateEnvFile(backendEnvPath, 'FRONTEND_URL', frontendUrl);

// Update API URL in frontend env  
const backendPort = '3001'; // Backend typically runs on 3001
const apiUrl = `http://localhost:${backendPort}/api`;
updateEnvFile(frontendEnvPath, 'NEXT_PUBLIC_API_URL', apiUrl);

// Silent completion - no verbose output
