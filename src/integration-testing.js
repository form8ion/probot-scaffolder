import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

export default function ({projectRoot, tests: {integration}}) {
  if (integration) return scaffoldCucumber({projectRoot});

  return {};
}
