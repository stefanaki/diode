#!/usr/bin/env node
const { program } = require('commander');

program.version('1.0.0').description('Diode CLI Tool - softeng21-08');

program
	.command('login')
	.description('log in to use the CLI tool')
	.requiredOption('--username <username>', 'Username')
	.requiredOption('--passw <password>', 'Password')
	.action(require('./commands/login'));

program.command('logout').description('log out').action(require('./commands/logout'));

program
	.command('healthcheck')
	.description('database connection health check')
	.action(require('./commands/healthCheck'));

program
	.command('resetpasses')
	.description('wipe all pass events from the database and reset admin credentials')
	.action(require('./commands/resetPasses'));

program
	.command('resetstations')
	.description('reset station data to the initial sample dataset')
	.action(require('./commands/resetStations'));

program
	.command('resetvehicles')
	.description('reset vehicle data to the initial sample dataset')
	.action(require('./commands/resetVehicles'));

program
	.command('passesperstation')
	.description('pass events at the specified toll station and time period')
	.requiredOption('--station <stationID>', 'Station ID')
	.requiredOption('--datefrom <date>', 'Start of specified period')
	.requiredOption('--dateto <date>', 'End of specified period')
	.requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
	.action(require('./commands/passesPerStation'));

program
	.command('passesanalysis')
	.description('pass events by vehicles with tags of op2 at toll stations of op1')
	.requiredOption('--op1 <operatorID>', 'Operator ID 1')
	.requiredOption('--op2 <operatorID>', 'Operator ID 2')
	.requiredOption('--datefrom <date>', 'Start of specified period')
	.requiredOption('--dateto <date>', 'End of specified period')
	.requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
	.action(require('./commands/passesAnalysis'));

program
	.command('passescost')
	.description('summary of pass events of vehicles with tags of op2 at toll stations of op1')
	.requiredOption('--op1 <operatorID>', 'Operator ID 1')
	.requiredOption('--op2 <operatorID>', 'Operator ID 2')
	.requiredOption('--datefrom <date>', 'Start of specified period')
	.requiredOption('--dateto <date>', 'End of specified period')
	.requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
	.action(require('./commands/passesCost'));

program
	.command('chargesby')
	.description(
		'charges and pass events at toll stations of op1 from vehicles with tags of another operator'
	)
	.requiredOption('--op1 <operatorID>', 'Operator ID 1')
	.requiredOption('--datefrom <date>', 'Start of specified period')
	.requiredOption('--dateto <date>', 'End of specified period')
	.requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
	.action(require('./commands/chargesBy'));

program
	.command('settlements')
	.description('settlement management operations')
	.option('--verify', "Mark a settlement's transaction status as completed")
	.option('--settlid <settlementID>', 'Settlement ID')
	.option('--list', 'List settlements between two operators in specified time period')
	.option('--create', 'Generate a new settlement between two operators in specified time period')
	.option('--op1 <operatorID>', 'Operator ID 1')
	.option('--op2 <operatorID>', 'Operator ID 2')
	.option('--datefrom <date>', 'Start of specified period')
	.option('--dateto <date>', 'End of specified period')
	.requiredOption('--format <format>', 'Response format type {json|csv}', 'json')
	.action(require('./commands/settlements'));

program
	.command('admin')
	.description('system administration operations')
	.option('--usermod', 'Modify or create new user')
	.option('--username <username>', 'User to be created or modified')
	.option('--passw <password>', 'Password of specified user')
	.option('--users <username>', 'User status')
	.option('--passesupd', 'Import new pass events from CSV file')
	.option('--source <filePath>', 'Source CSV file')
	.action(async (options) => {
		await require('./commands/admin')(options);
		process.exit();
	});

program.parse(process.argv);
