#!/usr/bin/env node
const { program } = require('commander');

program.version('1.0.0').description('Diode CLI Tool - softeng21-08');

program
    .command('login')
    .description('Log in to use the CLI tool')
    .requiredOption('--username <username>', 'Username')
    .requiredOption('--passw <password>', 'Password')
    .action(require('./commands/login'));

program.command('logout').description('Log out').action(require('./commands/logout'));

program
    .command('healthcheck')
    .description('Database connection health check')
    .action(require('./commands/healthCheck'));

program
    .command('resetpasses')
    .description('Wipe all pass events from the database and reset admin credentials')
    .action(require('./commands/resetPasses'));

program
    .command('resetstations')
    .description('Reset station data to the initial sample dataset')
    .action(require('./commands/resetStations'));

program
    .command('resetvehicles')
    .description('Reset vehicle data to the initial sample dataset')
    .action(require('./commands/resetVehicles'));

program
    .command('passesperstation')
    .description('All the pass events at the specified toll station and time period')
    .requiredOption('--station <stationID>', 'Station ID')
    .requiredOption('--datefrom <dateFrom>', 'Start of specified period')
    .requiredOption('--dateto <dateTo>', 'End of specified period')
    .requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
    .action(require('./commands/passesPerStation'));

program
    .command('passesanalysis')
    .description('All the pass events by vehicles with tags of op2 at stations of op1')
    .requiredOption('--op1 <operatorID>', 'Operator ID 1')
    .requiredOption('--op2 <operatorID>', 'Operator ID 2')
    .requiredOption('--datefrom <dateFrom>', 'Start of specified period')
    .requiredOption('--dateto <dateTo>', 'End of specified period')
    .requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
    .action(require('./commands/passesAnalysis'));

program
    .command('passescost')
    .description('Summary of the pass events of vehicles with tags of op2 at toll stations of op1')
    .requiredOption('--op1 <operatorID>', 'Operator ID 1')
    .requiredOption('--op2 <operatorID>', 'Operator ID 2')
    .requiredOption('--datefrom <dateFrom>', 'Start of specified period')
    .requiredOption('--dateto <dateTo>', 'End of specified period')
    .requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
    .action(require('./commands/passesCost'));

program
    .command('chargesby')
    .description('Debts of op1 to every other operator in the specified time period')
    .requiredOption('--op1 <operatorID>', 'Operator ID 1')
    .requiredOption('--datefrom <dateFrom>', 'Start of specified period')
    .requiredOption('--dateto <dateTo>', 'End of specified period')
    .requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
    .action(require('./commands/chargesBy'));

program
    .command('admin')
    .description('System administration operations')
    .option('--usermod', 'Modify or create new user')
    .option('--username <username>', 'Username')
    .option('--passw <password>', 'Password')
    .option('--users <username>', 'User status')
    .option('--passesupd', 'Import new pass events from CSV file')
    .option('--source <filename>', 'Source CSV file')
    .action(async (options) => {
        await require('./commands/admin')(options);
        process.exit();
    });

program.parse(process.argv);
