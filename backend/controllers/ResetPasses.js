const pool = require('./../config/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    try {
        const defaultUsername = 'admin',
            defaultPassword = 'freepasses4all';

        let encryptedPassword = await bcrypt.hash(defaultPassword, 10);

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM passes');

        let oldUser = await connection.query('SELECT * FROM admins WHERE username = ?', [defaultUsername]);
        if (!oldUser[0][0]) {
            await connection.query('INSERT INTO admins (username, password) VALUES (?, ?)', [
                defaultUsername,
                encryptedPassword
            ]);
        } else {
            await connection.query('UPDATE admins SET password = ? WHERE username = ?', [
                encryptedPassword,
                defaultUsername
            ]);
        }

        connection.release();
        return res.status(200).json({ status: 'OK' });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
};
