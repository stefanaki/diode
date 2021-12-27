#!/usr/bin/env node
const program = require('commander');

program.version('1.0.0').description('Diode CLI Tool - softeng21-08');

program
    .command('healthcheck')
    .description('Database connection health check')
    .requiredOption('-u, --username <username>', 'Admin username')
    .requiredOption('-p, --passw <password>', 'Admin password')
    .requiredOption('-f. --format <format>', 'Response format type { json | csv }')
    .action(require('./commands/healthCheck'));

program
    .command('resetpasses')
    .description('Wipe all pass events from the database and reset admin credentials')
    .requiredOption('-u, --username <username>', 'Admin username')
    .requiredOption('-p, --passw <password>', 'Admin password')
    .requiredOption('-f. --format <format>', 'Response format type { json | csv }')
    .action(require('./commands/resetPasses'));

program
    .command('resetstations')
    .description('Resets station data to the initial sample dataset')
    .requiredOption('-u, --username <username>', 'Admin username')
    .requiredOption('-p, --passw <password>', 'Admin password')
    .requiredOption('-f. --format <format>', 'Response format type { json | csv }')
    .action(require('./commands/resetStations'));

program
    .command('resetvehicles')
    .description('Resets vehicle data to the initial sample dataset')
    .requiredOption('-u, --username <username>', 'Admin username')
    .requiredOption('-p, --passw <password>', 'Admin password')
    .requiredOption('-f. --format <format>', 'Response format type { json | csv }')
    .action(require('./commands/resetVehicles'));

program.parse(process.argv);
