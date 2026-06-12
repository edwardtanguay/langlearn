const fs = require('fs');
const path = require('path');

// Dynamically load local .env file variables if present
let envConfig = {};
try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envFileContent = fs.readFileSync(envPath, 'utf-8');
    envFileContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key) {
          const val = values.join('=').trim().replace(/^['"]|['"]$/g, '');
          envConfig[key.trim()] = val;
        }
      }
    });
  }
} catch (e) {
  console.error('Failed to load .env file in PM2 config:', e);
}

module.exports = {
  apps: [
    {
      name: 'langlearn',
      port: '3149',
      instances: 1,
      exec_mode: 'fork',
      interpreter: '/home/edward/.nvm/versions/node/v20.20.2/bin/node', 
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3149,
        ...envConfig
      }
    }
  ]
};
