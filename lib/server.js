// External dependencies
import express from 'express';
import fs from 'fs';

// internal dependencies
import { renderHTMLFile } from './html.js';
import { compileFile } from './compiler.js';

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

  // Root route to src/html/index.html.ejs
  app.get('/', async (_, res) => {
    const fileName = "src/html/index.html.ejs";

    // Read the import map from the file system
    const importMap = JSON.parse(fs.readFileSync('importmap.json', 'utf8'));

    // Send the rendered HTML to the client
    res.send(renderHTMLFile(fileName, importMap));
  });

  // HTML routes
  app.get('/:name.html', async (req, res) => {
    const fileName = `src/html/${req.params.name}.html.ejs`;

    // Read the import map from the file system
    const importMap = JSON.parse(fs.readFileSync('importmap.json', 'utf8'));

    // Send the rendered HTML to the client
    res.send(renderHTMLFile(fileName, importMap));
  });

  // Start the server and listen for incoming requests
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
