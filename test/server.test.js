// External imports
import { describe, it } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';

// code under test
import { makeServer } from '../lib/server.js';

describe('server', async () => {
  describe('html', async () => {
    it('serves src/html/index.html.ejs as the root route', async () => {
      // given
      const server = makeServer({ workingDir: './fixtures/source' });

      // when
      const response = await request(server).get('/');

      // then
      assert.strictEqual(response.status, 200);
      assert.ok(response.text.includes('<!DOCTYPE html>'));
      assert.ok(response.text.includes('Wire App'));
      assert.ok(response.headers['content-type'].includes('text/html'));
    });

    it('serves other html files from src/html', async () => {
      // given
      const server = makeServer({ workingDir: './fixtures/source' });

      // when
      const response = await request(server).get('/about.html');

      // then
      assert.strictEqual(response.status, 200);
      assert.ok(response.text.includes('<!DOCTYPE html>'));
      assert.ok(response.text.includes('About'));
      assert.ok(response.headers['content-type'].includes('text/html'));
    });
  });

  describe('javascript', async () => {
    it('serves compiled javascripts files from src/typescript', async () => {
      // given
      const server = makeServer({ workingDir: './fixtures/source' });

      // when
      const response = await request(server).get('/javascript/application.js');

      // then
      assert.strictEqual(response.status, 200);
      assert.ok(response.headers['content-type'].includes('text/javascript'));
      assert.ok(response.text.includes('setupCounter'));
    });
  });

  describe('css', async () => {
    it('serves css files from src/css', async () => {
      // given
      const server = makeServer({ workingDir: './fixtures/source' });

      // when
      const response = await request(server).get('/application.css');

      // then
      assert.strictEqual(response.status, 200);
      assert.ok(response.headers['content-type'].includes('text/css'));
      assert.ok(response.text.includes('box-shadow'));
    });
  });
});
