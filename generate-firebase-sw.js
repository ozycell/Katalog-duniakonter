/**
 * Generate firebase-messaging-sw.js from template + .env variables
 * Run automatically before `npm run dev` and `npm run build`
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadEnv() {
  const envFiles = ['.env.local', '.env.development', '.env'];
  let env = {};
  for (const file of envFiles) {
    const filePath = path.join(projectRoot, file);
    const parsed = parseEnv(filePath);
    env = { ...env, ...parsed };
  }
  return env;
}

function generateSW() {
  const env = loadEnv();
  const templatePath = path.join(projectRoot, 'scripts', 'firebase-messaging-sw.template.js');
  
  if (!fs.existsSync(templatePath)) {
    console.error('❌ Template file not found:', templatePath);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = requiredKeys.filter((key) => !env[key]);
  if (missing.length > 0) {
    console.warn('⚠️  Firebase env vars missing, generating empty service worker');
    const outputPath = path.join(projectRoot, 'public', 'firebase-messaging-sw.js');
    fs.writeFileSync(outputPath, '// Firebase not configured\n', 'utf8');
    console.log('✅ Generated empty firebase-messaging-sw.js (no Firebase config)');
    return;
  }

  let output = template;
  output = output.replace(/__VITE_FIREBASE_API_KEY__/g, env.VITE_FIREBASE_API_KEY);
  output = output.replace(/__VITE_FIREBASE_AUTH_DOMAIN__/g, env.VITE_FIREBASE_AUTH_DOMAIN);
  output = output.replace(/__VITE_FIREBASE_PROJECT_ID__/g, env.VITE_FIREBASE_PROJECT_ID);
  output = output.replace(/__VITE_FIREBASE_STORAGE_BUCKET__/g, env.VITE_FIREBASE_STORAGE_BUCKET);
  output = output.replace(/__VITE_FIREBASE_MESSAGING_SENDER_ID__/g, env.VITE_FIREBASE_MESSAGING_SENDER_ID);
  output = output.replace(/__VITE_FIREBASE_APP_ID__/g, env.VITE_FIREBASE_APP_ID);
  output = output.replace(/__VITE_FIREBASE_MEASUREMENT_ID__/g, env.VITE_FIREBASE_MEASUREMENT_ID || '');

  const outputPath = path.join(projectRoot, 'public', 'firebase-messaging-sw.js');
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log('✅ Generated public/firebase-messaging-sw.js from .env');
}

generateSW();
