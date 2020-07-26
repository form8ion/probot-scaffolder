import {promises as fs} from 'fs';
import {resolve} from 'path';
import deepmerge from 'deepmerge';
import scaffoldIntegrationTesting from './integration-testing';

export default async function ({projectRoot, tests}) {
  const [integrationTestingResults] = await Promise.all([
    await scaffoldIntegrationTesting({projectRoot, tests}),
    fs.copyFile(resolve(__dirname, '..', 'templates', '.env.example'), `${projectRoot}/.env.example`),
    fs.writeFile(
      `${projectRoot}/nodemon.json`,
      JSON.stringify({
        env: {NODE_ENV: 'development'},
        exec: 'babel-node',
        watch: [
          'src/',
          '.env'
        ]
      })
    )
  ]);

  return deepmerge(
    {
      scripts: {
        dev: 'nodemon src/index.js',
        start: 'probot run ./lib/index.js'
      },
      dependencies: ['probot'],
      devDependencies: ['@babel/node', 'nodemon', 'smee-client']
    },
    integrationTestingResults
  );
}
