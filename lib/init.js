import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const copyDir = (src, dest) => {
  const files = glob.sync('**/*', { cwd: src, nodir: true });

  files.forEach(async (file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    await fs.mkdir(path.dirname(destFile), { recursive: true });
    await fs.copyFile(srcFile, destFile);
  });
}

export const init = async ({ workingDir }) => {
  const templateDir = path.join(fileURLToPath(import.meta.url), '../../template');

  copyDir(templateDir, workingDir);
}
