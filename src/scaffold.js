import {promises as fs} from 'fs';
import {resolve} from 'path';

export default async function ({projectRoot}) {
  await fs.copyFile(resolve(__dirname, '..', 'templates', '.env.example'), `${projectRoot}/.env.example`);

  return {
    dependencies: ['probot'],
    devDependencies: ['nodemon', 'smee-client']
  };
}
