#!/usr/bin/env node
const program = require('commander');

program.version('1.0.0').description('Diode CLI Tool - softeng21-08');

program
    .command('login')
    .description('Log in to use the CLI tool')
    .requiredOption('-u, --username <username>', 'Username')
    .requiredOption('-p, --passw <password>', 'Password')
    .action(require('./commands/login'));

program.command('logout').description('Log out').action(require('./commands/logout'));

program
    .command('healthcheck')
    .description('Database connection health check')
    .requiredOption('--format <format>', 'Response format type { json | csv }', 'json')
    .action(require('./commands/healthCheck'));

program.parse(process.argv);
