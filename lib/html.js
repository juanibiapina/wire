import ejs from 'ejs';
import fs from 'fs';

export const renderHTMLFile = (fileName, importMap, production) => {
  let html = ejs.render(fs.readFileSync(fileName, 'utf8'), {
    importMapScriptTag: () => `<script type="importmap">${JSON.stringify(importMap, null, 2)}</script>`,
    scriptModuleTag: (name) => `<script type="module" src="/javascript/${name}.js"></script>`,
    production: production,
  });

  return html;
};

