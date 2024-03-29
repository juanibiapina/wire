import swc from '@swc/core';
import fs from 'fs/promises';

export const compileFile = async (filename) => {
  const source = await fs.readFile(filename, 'utf8');

  const output = await swc.transform(source, {
    filename,
    isModule: true,
    swcrc: false,
  });

  return output.code;
}

