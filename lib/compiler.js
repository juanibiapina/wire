import swc from '@swc/core';
import fs from 'fs';

export const compileFile = async (filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = await swc.transform(source, {
    filename,
    isModule: true,
    swcrc: false,
  });
  return output.code;
}

