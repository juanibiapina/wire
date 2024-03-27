// External imports
import { describe, it } from 'node:test';
import fs from 'fs';
import path from 'path';
import os from 'os';
import assert from 'node:assert';

// code under test
import { init } from '../lib/init.js';

describe('init', async () => {
  it('creates an importmap.json file in the current directory', async () => {
    // given
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wire-test-'));

    // when
    init({
      workingDir: tempDir,
    });

    // then
    assert.ok(fs.existsSync(path.join(tempDir, 'importmap.json')));
  });
});
