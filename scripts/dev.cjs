const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const review = process.argv.includes('--review');
const children = [];
let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exitCode = exitCode;
}

async function availablePort(start) {
  for (let port = start; port < start + 100; port += 1) {
    const available = await new Promise((resolve, reject) => {
      const server = net.createServer();
      server.once('error', error => error.code === 'EADDRINUSE' || error.code === 'EACCES' ? resolve(false) : reject(error));
      server.listen(port, () => server.close(() => resolve(true)));
    });
    if (available) return port;
  }
  throw new Error(`No free port found starting at ${start}.`);
}

function launch(entry, directory, env) {
  const child = spawn(process.execPath, [entry], { cwd: path.join(root, directory), stdio: 'inherit', env });
  children.push(child);
  child.once('error', error => { console.error(error.message); stop(1); });
  child.once('exit', code => { if (!stopping) stop(code || 0); });
}

async function main() {
  for (const entry of ['frontend/node_modules/react-scripts/scripts/start.js', 'backend/node_modules/express/package.json']) {
    if (!fs.existsSync(path.join(root, entry))) throw new Error('Dependencies are missing. Run npm run setup first.');
  }
  const gitResult = spawnSync('git', ['rev-parse', '--git-common-dir'], { cwd: root, encoding: 'utf8' });
  const mainCheckout = gitResult.status === 0 && path.resolve(root, gitResult.stdout.trim()) === path.join(root, '.git');
  const offset = mainCheckout ? 0 : 100 + (parseInt(crypto.createHash('sha256').update(root).digest('hex').slice(0, 4), 16) % 1000) * 2;
  const frontendPort = await availablePort(3000 + offset);
  const backendPort = await availablePort(frontendPort + 1);
  const env = { ...process.env, BROWSER: 'none', HOST: '127.0.0.1', REACT_APP_API_URL: `http://localhost:${backendPort}`, REACT_APP_REVIEW_WORKTREE: root };
  console.log(`Portfolio: http://localhost:${frontendPort}`);
  console.log(`Review tab: http://localhost:${frontendPort}/review`);
  console.log(`Backend: http://localhost:${backendPort}/health`);
  if (review) console.log('Open the Review tab URL in Orca. Notes stay in this browser; copy a section brief into the chat to apply it.');
  launch(path.join(root, 'backend/src/index.js'), 'backend', { ...env, PORT: String(backendPort), VERCEL: '0' });
  launch(path.join(root, 'frontend/node_modules/react-scripts/scripts/start.js'), 'frontend', { ...env, PORT: String(frontendPort) });
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
main().catch(error => { console.error(error.message); stop(1); });
