#!/usr/bin/env node

/**
 * Generate secure random secrets for Strapi deployment
 * Run: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('\n=== Strapi Production Secrets ===\n');
console.log('Copy these values to your Railway/Render environment variables:\n');

const secrets = {
  'APP_KEYS': generateSecret(),
  'API_TOKEN_SALT': generateSecret(),
  'ADMIN_JWT_SECRET': generateSecret(),
  'TRANSFER_TOKEN_SALT': generateSecret(),
  'JWT_SECRET': generateSecret(),
  'ENCRYPTION_KEY': generateSecret(),
};

for (const [key, value] of Object.entries(secrets)) {
  console.log(`${key}=${value}`);
}

console.log('\n=== IMPORTANT ===');
console.log('- Keep these secrets secure');
console.log('- Never commit them to Git');
console.log('- Use different secrets for each environment');
console.log('- Store them in your deployment platform\'s environment variables\n');
