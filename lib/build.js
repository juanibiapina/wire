// External dependencies
import { Generator } from '@jspm/generator';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

// internal dependencies
import { renderHTMLFile } from './html.js';
import { compileFile } from './compiler.js';

export const build = async ({ workingDir, targetDir }) => {
  // make sure targetDir exists
  await fs.mkdir(targetDir, { recursive: true });

  // List all HTML files
  const htmlfiles = await glob(path.join(workingDir, 'src/html/**/*.html.ejs'));

  // function to load import map
  // depends on workingDir
  const loadImportMap = async () => {
    // Read the import map from the file system
    const importMapDev = JSON.parse(await fs.readFile(path.join(workingDir, 'importmap.json'), 'utf8'));

    // Change importMap to production

    // Create a new Generator instance with the existing import map
    const generator = new Generator({
      env: ['browser', 'module', 'production'],
      inputMap: importMapDev,
    });

    // Perform an empty install just to regenerate the import map with the production environment
    await generator.install();

    // Return production importMap
    return generator.getMap();
  };

  // Render all HTML templates in src/html to target directory
  for (const htmlfile of htmlfiles) {
    const html = await renderHTMLFile(htmlfile, loadImportMap, true, workingDir);

    const relativePath = path.relative(path.join(workingDir, 'src/html'), htmlfile);
    const distfile = path.join(targetDir, relativePath.replace('.ejs', ''));

    await fs.writeFile(distfile, html);
  }

  // List all typescript files
  const tsfiles = await glob(path.join(workingDir, 'src/typescript/**/*.tsx'));

  // Compile all typescript files to dist directory
  for (const tsfile of tsfiles) {
    const relativePath = path.relative(path.join(workingDir, 'src/typescript'), tsfile);
    const jsfile = path.join(targetDir, relativePath.replace('.tsx', '.js'));

    const js = await compileFile(tsfile);
    await fs.writeFile(jsfile, js);
  }

  // List all css files
  const cssfiles = await glob(path.join(workingDir, 'src/css/**/*.css'));

  // Copy all css files to dist directory
  for (const cssfile of cssfiles) {
    const relativePath = path.relative(path.join(workingDir, 'src'), cssfile);
    const distfile = path.join(targetDir, relativePath);

    // make sure path to distfile exists
    await fs.mkdir(path.dirname(distfile), { recursive: true });

    await fs.copyFile(cssfile, distfile);
  }

  // List all public files
  const publicfiles = await glob(path.join(workingDir, 'src/public/**/*'));

  // make sure public directory exists
  await fs.mkdir(path.join(targetDir, 'public'), { recursive: true });

  // Copy all public files to dist directory
  for (const publicfile of publicfiles) {
    const relativePath = path.relative(path.join(workingDir, 'src'), publicfile);
    const distfile = path.join(targetDir, relativePath);

    await fs.copyFile(publicfile, distfile);
  }
}
