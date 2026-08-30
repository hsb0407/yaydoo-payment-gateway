const { spawn } = require('child_process');

const processes = [
  {
    name: 'mock',
    cmd: 'node',
    args: ['mock/yaydoo.mock.js'],
    color: '\x1b[35m',
  },
  {
    name: 'gateway',
    cmd: 'npm',
    args: ['run', 'dev'],
    color: '\x1b[36m',
  },
];

const RESET = '\x1b[0m';
const children = [];

const prefix = (name, color) => (data) => {
  const lines = data.toString().trimEnd().split('\n');
  lines.forEach((line) => process.stdout.write(`${color}[${name}]${RESET} ${line}\n`));
};

processes.forEach(({ name, cmd, args, color }) => {
  const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], shell: false });
  children.push(child);
  child.stdout.on('data', prefix(name, color));
  child.stderr.on('data', prefix(name, color));
  child.on('exit', (code) => {
    process.stdout.write(`${color}[${name}]${RESET} salió con código ${code}\n`);
    shutdown(code || 0);
  });
  child.on('error', (err) => {
    process.stdout.write(`${color}[${name}]${RESET} error: ${err.message}\n`);
    shutdown(1);
  });
});

function shutdown(code) {
  if (shutdown.done) return;
  shutdown.done = true;
  children.forEach((child) => {
    if (!child.killed) child.kill('SIGINT');
  });
  setTimeout(() => process.exit(code), 300).unref();
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));