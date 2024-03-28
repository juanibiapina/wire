// External imports
import { describe, it } from 'node:test';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import assert from 'node:assert';
import { glob } from 'glob';

// code under test
import { build } from '../lib/build.js';

describe('build', async () => {
  it('builds a project according to expectations', async () => {
    // given
    const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wire-test-'));

    // when
    await build({
      workingDir: "./fixtures/source",
      targetDir: targetDir,
    });

    // then
    const expectedFiles = await glob(path.join('./fixtures/target/**/*'), { nodir: true });

    for await (const expectedFile of expectedFiles) {
      const relativePath = path.relative("./fixtures/target", expectedFile);
      const compiledFile = path.join(targetDir, relativePath);

      assert.ok(await fs.stat(compiledFile));
      assert.strictEqual(await fs.readFile(compiledFile, 'utf8'), await fs.readFile(expectedFile, 'utf8'));
    }
  });
});
