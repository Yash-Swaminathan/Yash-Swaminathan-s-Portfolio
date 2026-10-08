const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const environmentFiles = ['.env', 'frontend/.env', 'frontend/.env.local', 'frontend/.env.development.local', 'backend/.env'];
const gitResult = spawnSync('git', ['worktree', 'list', '--porcelain', '-z'], { cwd: root, encoding: 'utf8' });
const primaryEntry = gitResult.status === 0 ? gitResult.stdout.split('\0').find(entry => entry.startsWith('worktree ')) : undefined;
const primaryRoot = primaryEntry ? primaryEntry.slice('worktree '.length) : undefined;

if (primaryRoot && path.resolve(primaryRoot) !== root) {
  for (const relativePath of environmentFiles) {
    const source = path.join(primaryRoot, relativePath);
    const target = path.join(root, relativePath);
    if (!fs.existsSync(target) && fs.existsSync(source) && fs.statSync(source).isFile()) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
      console.log(`Copied local configuration: ${relativePath}`);
    }
  }
}

const npmCli = process.env.npm_execpath;
for (const directory of ['frontend', 'backend']) {
  console.log(`Installing ${directory} dependencies from its lockfile...`);
  const args = ['ci', '--legacy-peer-deps', '--no-audit', '--no-fund'];
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, ...args], { cwd: path.join(root, directory), stdio: 'inherit' })
    : spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
      cwd: path.join(root, directory), stdio: 'inherit', shell: process.platform === 'win32'
    });
  if (result.error || result.status !== 0) {
    console.error(`Dependency installation failed for ${directory}.`, result.error?.message || '');
    process.exit(result.status || 1);
  }
}

if (!fs.existsSync(path.join(root, 'frontend/.env'))) {
  console.warn('No frontend/.env found. Configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY before previewing the portfolio.');
}
console.log('Setup complete. Run npm run review for the guided review, or npm run dev for the portfolio.');
