// External imports
import { Generator } from '@jspm/generator';
import ejs from 'ejs';
import fs from 'fs';
import { glob } from 'glob';
import swc from '@swc/core';

const compileFile = async (filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = await swc.transform(source, {
    filename,
    isModule: true,
    swcrc: false,
  });
  return output.code;
}

export const build = async () => {
  // Read the import map from the file system
  const importMap = JSON.parse(fs.readFileSync('importmap.json', 'utf8'));

  // Change importMap to production

  // Create a new Generator instance with the existing import map
  const generator = new Generator({
    env: ['browser', 'module', 'production'],
    inputMap: importMap,
  });

  // Perform an empty install just to regenerate the import map with the production environment
  await generator.install();

  // Render the index.html template with the import map
  let html = ejs.render(fs.readFileSync('src/index.html.ejs', 'utf8'), {
    importMapScriptTag: () => `<script type="importmap">${JSON.stringify(generator.getMap(), null, 2)}</script>`,
    scriptModuleTag: (name) => `<script type="module" src="${name}.js"></script>`,
    production: true,
  });

  // Write the rendered HTML to the file system
  fs.writeFileSync('dist/index.html', html);

  // List all typescript files
  const tsfiles = await glob('src/typescript/**/*.tsx');

  // Compile all typescript files to dist directory
  for (const tsfile of tsfiles) {
    const jsfile = tsfile.replace('src/typescript', 'dist').replace('.tsx', '.js');
    const js = await compileFile(tsfile);
    fs.writeFileSync(jsfile, js);
  }
}
