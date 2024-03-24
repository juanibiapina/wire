// External imports
import { Generator } from '@jspm/generator';
import fs from 'fs';

export const pin = async (dependency) => {
  // Path to the import map file
  const importmapFile = 'importmap.json';

  // Create a new Generator instance with the input map
  const generator = new Generator({
    inputMap: fs.readFileSync(importmapFile, 'utf8'),
  });

  // Install the dependency into the map
  await generator.install(dependency);

  // Write the updated map back to the file system
  fs.writeFileSync(importmapFile, JSON.stringify(generator.getMap(), null, 2));
}
