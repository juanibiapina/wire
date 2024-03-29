// Definitions for the CLI.
// This module is used by the bin/wire script.
// Careful when changing the public interface since bin/wire is not tested.

// External dependencies
import { Command } from 'commander';

// Internal dependencies
import { makeServer, startServer } from './server.js';
import { pin } from './importmap.js';
import { build } from './build.js';
import { init } from './init.js';

export const makeCli = () => {
  const program = new Command();

  program
    .name('wire')
    .description('Lightweight frontend tooling')
    .version('0.0.1');

  program.command('init')
    .description('Create a minimum wire project')
    .option('--working-dir <workingDir>', 'The working directory to use', process.cwd())
    .action((options) => init({ workingDir: options.workingDir }));

  program.command('dev')
    .description('Start a development server')
    .option('--working-dir <workingDir>', 'The working directory to use', process.cwd())
    .action(async (options) => {
      const server = makeServer({ workingDir: options.workingDir });
      startServer(server);
    });

  program.command('build')
    .description('Build the project')
    .option('--working-dir <workingDir>', 'Working directory', process.cwd())
    .option('--target-dir <targetDir>', 'Directory to output compiled files', "dist")
    .action((options) => build({ workingDir: options.workingDir, targetDir: options.targetDir }));

  program.command('importmap')
    .description('Work with importmap')
    .command('pin')
    .description('Pin a dependency to the import map')
    .argument('<dependency>', 'The dependency to pin')
    .action(pin);

  return () => {
    program.parse();
  };
};
