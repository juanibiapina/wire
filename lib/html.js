import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const includeCSSDirectory = (directory, workingDir) => {
  // list all CSS files in directory recursively
  const cssFiles = glob.sync(path.join(workingDir, `src/css/${directory}/**/*.css`));

  // generate one link tag for each CSS file
  return cssFiles.map((cssFile) => {
    const relativePath = path.relative(path.join(workingDir, 'src'), cssFile);

    return `<link rel="stylesheet" href="/${relativePath}">`;
  }).join('\n');
};

export const renderHTMLFile = async (fileName, getImportMap, production, workingDir) => {
  let html = await ejs.render(fs.readFileSync(fileName, 'utf8'), {
    importMapScriptTag: async () => `<script type="importmap">${JSON.stringify(await getImportMap(), null, 2)}</script>`,
    scriptModuleTag: (name) => `<script type="module" src="/javascript/${name}.js"></script>`,
    stylesheetLinkTag: (name) => `<link rel="stylesheet" href="/css/${name}.css">`,
    includeCSSDirectory: (name) => includeCSSDirectory(name, workingDir),
    production: production,
  }, {
    async: true,
  });

  return html;
};

