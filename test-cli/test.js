#!/usr/bin/env node
const { program } = require('commander');

program.version('1.0.0').description('Diode CLI Testing Tool - softeng21-08');

program
	.command('successful')
	.requiredOption('--username <username>', 'Username')
	.requiredOption('--passw <password>', 'Password')
	.requiredOption('--station <stationID>', 'Station ID')
	.requiredOption('--op1 <operatorID>', 'Operator ID 1')
	.requiredOption('--op2 <operatorID>', 'Operator ID 2')
	.requiredOption('--datefrom <date>', 'Date from')
	.requiredOption('--dateto <date>', 'Date to')
	.requiredOption('--format <format>', 'Response format')
	.requiredOption('--rounds <numberOfRounds>', 'Number of rounds')
	.action(require('./tests/successfulTests'));

program
	.command('failed')
	.requiredOption('--rounds <numberOfRounds>', 'Number of rounds')
	.action(require('./tests/failedTests'));

program.parse(process.argv);
