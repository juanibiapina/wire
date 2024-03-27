// External imports
import { describe, it } from 'node:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import assert from 'node:assert';
import { glob } from 'glob';

// code under test
import { init } from '../lib/init.js';

describe('init', async () => {
  it('all created files in current directory match the files in template directory recursively', async () => {
    // given
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wire-test-'));

    // when
    init({
      workingDir: tempDir,
    });

    // then
    const templateFiles = glob.sync('./template/**/*', { nodir: true });

    templateFiles.forEach((templateFile) => {
      const relativePath = path.relative('./template', templateFile);
      const createdFile = path.join(tempDir, relativePath);

      assert.ok(fs.existsSync(createdFile));
      assert.strictEqual(fs.readFileSync(createdFile, 'utf8'), fs.readFileSync(templateFile, 'utf8'));
    });
  });
});
