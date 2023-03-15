import { spawn } from 'node:child_process';
import pkg from '../../package.json' assert { type: 'json' };
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const buildSrc = () => {
  const childProcess = spawn(
    'pnpm',
    [
      'tsc',
      '-p',
      'scripts/cjs/tsconfig.build.json',
      '&&',
      'tsc-alias',
      '-p',
      'scripts/cjs/tsconfig.build.json',
    ],
    { shell: true }
  );

  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
};

const createPackageJson = () => {
  const cjsPkg: typeof pkg = {
    ...pkg,
    type: 'commonjs',
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const distCjsDir = path.resolve(__dirname, '../../dist/cjs');
  const pkgPath = path.resolve(distCjsDir, 'package.json');

  if (!fs.existsSync(distCjsDir)) {
    fs.mkdirSync(distCjsDir, { recursive: true });
  }

  fs.writeFileSync(pkgPath, JSON.stringify(cjsPkg, null, 2));
};

const buildCjs = () => {
  buildSrc();
  createPackageJson();
};

buildCjs();
