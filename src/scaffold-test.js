import {promises as fs} from 'fs';
import {resolve} from 'path';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'copyFile');
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that probot is initialized', async () => {
    const projectRoot = any.string();

    const {dependencies, devDependencies, scripts} = await scaffold({projectRoot});

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
    assert.deepEqual(dependencies, ['probot']);
    assert.deepEqual(devDependencies, ['nodemon', 'smee-client']);
    assert.deepEqual(
      scripts,
      {
        dev: 'nodemon src/index.js',
        start: 'probot run ./lib/index.js'
      }
    );
  });
});
