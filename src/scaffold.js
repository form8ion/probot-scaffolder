import {promises as fs} from 'fs';
import {resolve} from 'path';

export default async function ({projectRoot}) {
  await Promise.all([
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

  return {
    scripts: {
      dev: 'nodemon src/index.js',
      start: 'probot run ./lib/index.js'
    },
    dependencies: ['probot'],
    devDependencies: ['nodemon', 'smee-client']
  };
}
