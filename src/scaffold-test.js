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
  });

  teardown(() => sandbox.restore());

  test('that probot is initialized', async () => {
    const projectRoot = any.string();

    const {dependencies, devDependencies} = await scaffold({projectRoot});

    assert.calledWith(
      fs.copyFile, resolve(__dirname, '..', 'templates', '.env.example'),
      `${projectRoot}/.env.example`
    );
    assert.deepEqual(dependencies, ['probot']);
    assert.deepEqual(devDependencies, ['nodemon', 'smee-client']);
  });
});
