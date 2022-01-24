const cp = require('child_process');
const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');

String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, '');
};

module.exports = async ({
	username,
	passw,
	station,
	op1,
	op2,
	datefrom,
	dateto,
	format,
	rounds
}) => {
	let datefromFmt = moment(datefrom, 'YYYYMMDD').format('YYYY-MM-DD');
	let datetoFmt = moment(dateto, 'YYYYMMDD').format('YYYY-MM-DD');
	let commands = [
		{
			cmd: `se2108 login --username ${username} --passw ${passw}`,
			out: `Welcome, ${username}. Type se2108 --help to display available commands.\n`,
			file: '.token'
		},
		{
			cmd: 'se2108 healthcheck',
			out:
				'Connection status: OK\n' +
				'Connection string: mysql;host=db;port=3306;db_name=diode_io;user=root;password=rootroot123;connection_limit=10\n',
			file: null
		},
		{
			cmd: `se2108 passesperstation --station ${station} --datefrom ${datefrom} --dateto ${dateto} --format ${format}`,
			out: `Created data file passesperstation_${station}_${datefromFmt}_${datetoFmt}.${format}\n`,
			file: `passesperstation_${station}_${datefromFmt}_${datetoFmt}.${format}`
		},
		{
			cmd: `se2108 passesanalysis --op1 ${op1} --op2 ${op2} --datefrom ${datefrom} --dateto ${dateto} --format ${format}`,
			out: `Created data file passesanalysis_${op1}_${op2}_${datefromFmt}_${datetoFmt}.${format}\n`,
			file: `passesanalysis_${op1}_${op2}_${datefromFmt}_${datetoFmt}.${format}`
		},
		{
			cmd: `se2108 passescost --op1 ${op1} --op2 ${op2} --datefrom ${datefrom} --dateto ${dateto} --format ${format}`,
			out: `Created data file passescost_${op1}_${op2}_${datefromFmt}_${datetoFmt}.${format}\n`,
			file: `passescost_${op1}_${op2}_${datefromFmt}_${datetoFmt}.${format}`
		},
		{
			cmd: `se2108 chargesby --op1 ${op1} --datefrom ${datefrom} --dateto ${dateto} --format ${format}`,
			out: `Created data file chargesby_${op1}_${datefromFmt}_${datetoFmt}.${format}\n`,
			file: `chargesby_${op1}_${datefromFmt}_${datetoFmt}.${format}`
		},
		{
			cmd: `se2108 settlements --list --datefrom 20200101 --dateto 20210101 --format ${format}`,
			out: `Created data file settlements_2020-01-01_2021-01-01.${format}\n`,
			file: `settlements_2020-01-01_2021-01-01.${format}`
		},
		{
			cmd: `se2108 admin --usermod --username admin --passw 12345`,
			out: `Password of user admin has been updated sucessfully\n`,
			file: null
		},
		{
			cmd: `se2108 admin --users admin`,
			out: `{ id: 1, username: 'admin', accountType: 'admin', status: 'active' }\n`,
			file: null
		},
		{
			cmd: `se2108 resetpasses`,
			out: `OK\n`,
			file: null
		},
		{
			cmd: `se2108 resetstations`,
			out: `OK\n`,
			file: null
		},
		{
			cmd: `se2108 resetvehicles`,
			out: `OK\n`,
			file: null
		},
		{
			cmd: `se2108 admin --passesupd --source ./csv/sample_data.csv`,
			out: `New events imported successfully\n`,
			file: null
		},
		{
			cmd: `se2108 logout`,
			out: `Log out successful\n`,
			file: null
		}
	];

	let numOfTests =
		commands.reduce((acc, cmd) => (cmd.file ? (acc += 2) : (acc += 1)), 0) * rounds;
	let failedTests = 0;

	for (let i = 1; i <= rounds; ++i) {
		console.log('\n------------------\n');

		console.log(`\nRound ${i}\n`);

		for (const c of commands) {
			console.log(chalk.blue('Executing command: \t') + c.cmd);
			let stdout = cp.execSync(c.cmd).toString();
			if (stdout === c.out) console.log('Standard output: \t' + chalk.green('OK ✓'));
			else {
				console.log('Standard output: \t' + chalk.red('Not OK ✗'));
				console.log('Expected output: \t' + c.out.trim());
				console.log('CLI response: \t\t' + stdout.trim());
				++failedTests;
			}
			if (c.file) {
				if (fs.existsSync(c.file)) {
					console.log('File created: \t\t' + chalk.green('OK ✓'));
					if (c.file !== '.token') fs.unlinkSync(c.file);
				} else {
					console.log('File created: \t\t' + chalk.red('Not OK ✗'));
					++failedTests;
				}
			}
			console.log('\n------------------\n');
			// await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}

	console.log('Report');
	console.log('Total tests: ' + chalk.blue(numOfTests));
	console.log('Successful tests: ' + chalk.green(numOfTests - failedTests));
	console.log('Failed tests: ' + chalk.red(failedTests));
};
