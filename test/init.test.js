// External imports
import { describe, it } from 'node:test';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import assert from 'node:assert';
import { glob } from 'glob';

// code under test
import { init } from '../lib/init.js';

describe('init', async () => {
  it('all created files in current directory match the files in template directory recursively', async () => {
    // given
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wire-test-'));

    // when
    await init({
      workingDir: tempDir,
    });

    // then
    const templateFiles = await glob('./template/**/*', { nodir: true });

    for await (const templateFile of templateFiles) {
      const relativePath = path.relative('./template', templateFile);
      const createdFile = path.join(tempDir, relativePath);

      assert.ok(await fs.stat(createdFile));
      assert.strictEqual(await fs.readFile(createdFile, 'utf8'), await fs.readFile(templateFile, 'utf8'));
    }
  });
});
