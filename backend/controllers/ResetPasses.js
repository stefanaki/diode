const pool = require('./../config/db');
const bcrypt = require('bcryptjs');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const defaultUsername = 'admin',
		defaultPassword = 'freepasses4all';

	try {
		const connection = await pool.getConnection();
		try {
			let encryptedPassword = await bcrypt.hash(defaultPassword, 10);

			await connection.query('DELETE FROM passes');

			let oldUser = await connection.query('SELECT * FROM users WHERE username = ?', [
				defaultUsername
			]);
			if (!oldUser[0][0]) {
				await connection.query(
					'INSERT INTO users (username, password, type) VALUES (?, ?, ?)',
					[defaultUsername, encryptedPassword, 'admin']
				);
			} else {
				await connection.query('UPDATE users SET password = ? WHERE username = ?', [
					encryptedPassword,
					defaultUsername
				]);
			}

			sendResponse(req, res, 200, { status: 'OK' });
		} catch (error) {
			console.log(error);
			sendResponse(req, res, 500, { status: 'Failed', message: 'Internal server error' });
		} finally {
			connection.release();
		}
	} catch {
		sendResponse(req, res, 500, {
			message:
				'Could not connect to the database. Run a connection healthcheck for more information.'
		});
	}
};
