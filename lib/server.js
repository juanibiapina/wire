// External dependencies
import express from 'express';
import ejs from 'ejs';
import fs from 'fs';
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

export const server = async () => {
  // Create an Express application
  const app = express();
  const port = 3000; // Set the port number to listen on

  // Compile and serve TypeScript files
  app.get('/javascript/:fname.js', async (req, res) => {
    const { fname } = req.params;
    const tsFileName = `src/typescript/${fname}.tsx`;

    const js = await compileFile(tsFileName);

    res.setHeader('content-type', 'text/javascript');
    res.send(js);
  });

  // Root route
  app.get('/', async (_, res) => {
    // Read the import map from the file system
    const importMap = JSON.parse(fs.readFileSync('importmap.json', 'utf8'));

    // Render the index.html template with the import map
    let html = ejs.render(fs.readFileSync('src/html/index.html.ejs', 'utf8'), {
      importMapScriptTag: () => `<script type="importmap">${JSON.stringify(importMap, null, 2)}</script>`,
      scriptModuleTag: (name) => `<script type="module" src="/javascript/${name}.js"></script>`,
      production: false,
    });

    // Send the rendered HTML to the client
    res.send(html);
  });

  // Start the server and listen for incoming requests
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
