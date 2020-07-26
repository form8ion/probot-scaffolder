import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';
import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';
import scaffold from './integration-testing';

suite('integration tests', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(cucumberScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the cucumber is configured when the project should be integration tested', async () => {
    const projectRoot = any.string();
    const cucumberResults = any.simpleObject();
    cucumberScaffolder.scaffold.withArgs({projectRoot}).resolves(cucumberResults);

    assert.deepEqual(await scaffold({projectRoot, tests: {integration: true}}), cucumberResults);
  });

  test('that the cucumber is not configured when the project should not be integration tested', async () => {
    cucumberScaffolder.scaffold.resolves({});

    assert.deepEqual(await scaffold({tests: {integration: false}}), {});
  });
});
