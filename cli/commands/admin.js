const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const prompt = require('prompt-sync')();

const db = mysql
	.createConnection({
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME
	})
	.promise();

module.exports = async ({ usermod, username, passw, users, passesupd, source }) => {
	if (usermod && !(username && passw)) {
		return console.log('Both username and password should be specified');
	}

	if (passesupd && !source) {
		return console.log('Please provide a source file');
	}

	try {
		if (!fs.existsSync('.token')) return console.log('Please log in first.');
		const token = fs.readFileSync('.token', 'utf8');
		if (token.length === 0) return console.log('Please log in first.');

		try {
			const payload = jwt.verify(token, process.env.TOKEN_KEY);
			if (payload.type !== 'admin') {
				return console.log('Please log in with an admin account first');
			}
		} catch (error) {
			return console.log('Please log in again');
		}

		if (usermod) {
			const userQuery = await db.query('SELECT * FROM users WHERE username = ?', [username]);
			const encryptedPassword = await bcrypt.hash(passw, 10);
			if (!userQuery[0][0]) {
				// Create new user
				let type = prompt(
					'Choose one of the following user types: admin, operator, transportation, bank '
				);
				if (
					type !== 'admin' &&
					type !== 'operator' &&
					type !== 'transportation' &&
					type !== 'bank'
				)
					return console.log('Invalid user type');
				await db.query('INSERT INTO users (username, password, type) VALUES (?, ?, ?)', [
					username,
					encryptedPassword,
					type
				]);
				console.log(`User ${username} created successfully`);
			} else {
				// Update existing user's password
				if (await bcrypt.compare(passw, userQuery[0][0].password)) {
					return console.log('New password and current password must not be the same');
				} else {
					await db.query('UPDATE users SET password = ? WHERE id = ?', [
						encryptedPassword,
						userQuery[0][0].id
					]);
					console.log(`Password of user ${username} has been updated sucessfully`);
				}
			}
		}

		if (users) {
			const username = users;
			const userQuery = await db.query('SELECT * FROM users WHERE username = ?', [username]);
			if (!userQuery[0][0]) {
				console.log(`User with name ${username} not found`);
			} else {
				console.log({
					id: userQuery[0][0].id,
					username: userQuery[0][0].username,
					accountType: userQuery[0][0].type,
					status: userQuery[0][0].status
				});
			}
		}

		if (passesupd) {
			await db.query({
				sql: `LOAD DATA LOCAL INFILE ?
                INTO TABLE vehicles
                FIELDS TERMINATED BY ','
                ENCLOSED BY '"'
                LINES TERMINATED BY '\n'
                IGNORE 1 ROWS
                (@id, @station, @vehicle, @tag, @timestmp, @charge, @provider, @license)
                SET vehicle_id = @vehicle, license_year = @license`,
				values: [source],
				infileStreamFactory: () => fs.createReadStream(source)
			});

			await db.query({
				sql: `LOAD DATA LOCAL INFILE ?
                INTO TABLE tags
                FIELDS TERMINATED BY ','
                ENCLOSED BY '"'
                LINES TERMINATED BY '\n'
                IGNORE 1 ROWS
                (@id, @station, @vehicle, @tag, @timestmp, @charge, @provider, @license)
                SET tag_id = @tag, vehicle_id = @vehicle, tag_provider = @provider`,
				values: [source],
				infileStreamFactory: () => fs.createReadStream(source)
			});

			await db.query({
				sql: `LOAD DATA LOCAL INFILE ?
                INTO TABLE passes
                FIELDS TERMINATED BY ','
                ENCLOSED BY '"'
                LINES TERMINATED BY '\n'
                IGNORE 1 ROWS
                (@id, @station, @vehicle, @tag, @timestmp, @charge, @provider, @license)
                SET pass_id = @id, station_id = @station, tag_id = @tag, pass_charge = @charge,
                pass_timestamp = str_to_date(@timestmp, '%c/%e/%Y %k:%i');`,
				values: [source],
				infileStreamFactory: () => fs.createReadStream(source)
			});
			console.log('New events imported successfully');
		}

		db.end();
	} catch (error) {
		console.log('Something went wrong...');
		console.error(error.message);
	} finally {
		db.end();
	}
};
