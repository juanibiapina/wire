import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const copy = (src, dest) => {
  fs.copyFileSync(src, dest);
}

const copyDir = (src, dest) => {
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = `${src}/${file}`;
    const destFile = `${dest}/${file}`;
    if (fs.lstatSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      copy(srcFile, destFile);
    }
  }
}

export const init = () => {
  const templateDir = path.join(fileURLToPath(import.meta.url), '../../template');

  copyDir(templateDir, '.');
}
