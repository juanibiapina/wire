// External dependencies
import { Generator } from '@jspm/generator';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import swc from '@swc/core';

// internal dependencies
import { renderHTMLFile } from './html.js';

const compileFile = async (filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = await swc.transform(source, {
    filename,
    isModule: true,
    swcrc: false,
  });
  return output.code;
}

export const build = async ({ workingDir, targetDir }) => {
  // make sure targetDir exists
  fs.mkdirSync(targetDir, { recursive: true });

  // Read the import map from the file system
  const importMapDev = JSON.parse(fs.readFileSync(path.join(workingDir, 'importmap.json'), 'utf8'));

  // Change importMap to production

  // Create a new Generator instance with the existing import map
  const generator = new Generator({
    env: ['browser', 'module', 'production'],
    inputMap: importMapDev,
  });

  // Perform an empty install just to regenerate the import map with the production environment
  await generator.install();

  // Get production importMap
  const importMap = generator.getMap();

  // List all HTML files
  const htmlfiles = await glob(path.join(workingDir, 'src/html/**/*.html.ejs'));

  // Render all HTML templates in src/html to target directory
  for (const htmlfile of htmlfiles) {
    const html = renderHTMLFile(htmlfile, importMap);

    const relativePath = path.relative(path.join(workingDir, 'src/html'), htmlfile);
    const distfile = path.join(targetDir, relativePath.replace('.ejs', ''));

    fs.writeFileSync(distfile, html);
  }

  // List all typescript files
  const tsfiles = await glob(path.join(workingDir, 'src/typescript/**/*.tsx'));

  // Compile all typescript files to dist directory
  for (const tsfile of tsfiles) {
    const relativePath = path.relative(path.join(workingDir, 'src/typescript'), tsfile);
    const jsfile = path.join(targetDir, relativePath.replace('.tsx', '.js'));

    const js = await compileFile(tsfile);
    fs.writeFileSync(jsfile, js);
  }
}
