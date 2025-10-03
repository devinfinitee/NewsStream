#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const nodeModules = path.join(root, 'node_modules');

function hasVite() {
  try {
    const p = path.join(nodeModules, 'vite');
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  return res.status === 0;
}

function tryInstall() {
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  console.log('• Installing dependencies (this may take a minute)...');
  if (run(npmCmd, ['install'])) return true;

  console.warn('\n! npm install failed. Trying pnpm...');
  const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  if (run(pnpmCmd, ['install'])) return true;

  console.warn('\n! pnpm install failed. Trying bun...');
  const bunCmd = process.platform === 'win32' ? 'bun.exe' : 'bun';
  if (run(bunCmd, ['install'])) return true;

  console.error('\n× All installers failed (npm, pnpm, bun).');
  console.error('  - Use Command Prompt or PowerShell (not Git Bash)');
  console.error('  - Close editors/terminals locking node_modules');
  console.error('  - Delete node_modules and package-lock.json and retry');
  console.error('  - Or use Docker:  docker compose up --build');
  return false;
}

if (!fs.existsSync(nodeModules) || !hasVite()) {
  console.log('• Dependencies not found. Running install...');
  if (!tryInstall()) process.exit(1);
} else {
  // Quick sanity check for corrupted installs
  try {
    require.resolve('vite');
  } catch {
    console.log('• Vite not resolved. Reinstalling dependencies...');
    if (!tryInstall()) process.exit(1);
  }
}

console.log('✓ Dependencies ready. Starting dev server...');
