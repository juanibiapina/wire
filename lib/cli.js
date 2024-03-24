// External dependencies
import { program } from 'commander';

// Internal dependencies
import { server } from './server.js';
import { pin } from './importmap.js';
import { build } from './build.js';
import { init } from './init.js';

const cli = () => {
  program
    .name('wire')
    .description('Lightweight frontend tooling')
    .version('0.0.1');

  program.command('init')
    .description('Create a minimum wire project')
    .action(init);

  program.command('dev')
    .description('Start a development server')
    .action(server);

  program.command('build')
    .description('Build the project')
    .action(build);

  program.command('importmap')
    .description('Work with importmap')
    .command('pin')
    .description('Pin a dependency to the import map')
    .argument('<dependency>', 'The dependency to pin')
    .action(pin);

  program.parse();
}

export default cli;
