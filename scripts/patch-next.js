#!/usr/bin/env node

/**
 * Patches Next.js to work with npm workspaces.
 * 
 * Next.js 14.x calls `npm config get registry` and `npm config get https-proxy`
 * internally, which fail with ENOWORKSPACES in npm 10.x when inside a workspace.
 * 
 * This script patches those calls to return sensible defaults.
 * Run after `npm install` or add to postinstall script.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT, 'node_modules', 'next', 'dist', 'lib', 'helpers');

function patchFile(filename, patches) {
  const filePath = path.join(NEXT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  Skipping ${filename} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let patched = false;

  for (const [search, replace] of patches) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      patched = true;
    }
  }

  if (patched) {
    fs.writeFileSync(filePath, content);
    console.log(`  Patched ${filename}`);
  } else {
    console.log(`  ${filename} already patched or no match`);
  }
}

console.log('Patching Next.js for npm workspace compatibility...');

// Patch get-registry.js - return default registry without calling npm
patchFile('get-registry.js', [
  [
    'function getRegistry(baseDir = process.cwd()) {',
    'function getRegistry(baseDir = process.cwd()) { return "https://registry.npmjs.org";'
  ]
]);

// Patch get-online.js - skip npm proxy check
patchFile('get-online.js', [
  [
    'async function getOnline() {',
    'async function getOnline() { return true; } async function _getOnline() {'
  ]
]);

console.log('Done.\n');
