import {promises as fs} from 'fs';
import {resolve} from 'path';
import deepmerge from 'deepmerge';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as integrationTesting from './integration-testing';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(integrationTesting, 'default');
    sandbox.stub(fs, 'copyFile');
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that probot is initialized', async () => {
    const projectRoot = any.string();
    const integrationTestingResults = any.simpleObject();
    const tests = any.simpleObject();
    integrationTesting.default.withArgs({projectRoot, tests}).resolves(integrationTestingResults);

    const results = await scaffold({projectRoot, tests});

    assert.calledWith(
      fs.copyFile,
      resolve(__dirname, '..', 'templates', '.env.example'),
      `${projectRoot}/.env.example`
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/nodemon.json`,
      JSON.stringify({
        env: {NODE_ENV: 'development'},
        exec: 'babel-node',
        watch: [
          'src/',
          '.env'
        ]
      })
    );
    assert.deepEqual(
      results,
      deepmerge(
        {
          dependencies: ['probot'],
          devDependencies: ['@babel/node', 'nodemon', 'smee-client'],
          scripts: {
            dev: 'nodemon src/index.js',
            start: 'probot run ./lib/index.js'
          }
        },
        integrationTestingResults
      )
    );
  });
});
