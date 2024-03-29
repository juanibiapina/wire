// External dependencies
import express from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs/promises';
import path from 'path';

// internal dependencies
import { renderHTMLFile } from './html.js';
import { compileFile } from './compiler.js';

export const makeServer = ({ workingDir }) => {
  // Create an Express application
  const app = express();

  // Serve static files from the public directory
  app.use("/public", express.static(path.join(workingDir, "src/public")));

  // Compile and serve TypeScript files
  app.get('/javascript/:fname.js', asyncHandler(async (req, res) => {
    const { fname } = req.params;
    const tsFileName = path.join(workingDir, `src/typescript/${fname}.tsx`);

    const js = await compileFile(tsFileName);

    res.setHeader('content-type', 'text/javascript');
    res.send(js);
  }));

  // Root route to src/html/index.html.ejs
  app.get('/', asyncHandler(async (_, res) => {
    const fileName = path.join(workingDir, "src/html/index.html.ejs");

    // Read the import map from the file system
    const importMap = JSON.parse(await fs.readFile(path.join(workingDir, 'importmap.json'), 'utf8'));

    // Send the rendered HTML to the client
    res.send(renderHTMLFile(fileName, importMap, false, workingDir));
  }));

  // HTML routes
  app.get('/:name.html', asyncHandler(async (req, res) => {
    const fileName = path.join(workingDir, `src/html/${req.params.name}.html.ejs`);

    // Read the import map from the file system
    const importMap = JSON.parse(await fs.readFile(path.join(workingDir, 'importmap.json'), 'utf8'));

    // Send the rendered HTML to the client
    res.send(renderHTMLFile(fileName, importMap, false));
  }));

  // CSS routes
  app.get('/css/:path(*).css', asyncHandler(async (req, res) => {
    const fileName = path.join(workingDir, `src/css/${req.params.path}.css`);

    res.setHeader('content-type', 'text/css');
    res.send(await fs.readFile(fileName, 'utf8'));
  }));

  return app;
};

export const startServer = (server) => {
  const port = 3000; // Set the port number to listen on

  server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};
