const pool = require('./../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password))
            return res.status(400).json({ message: 'Username and password required' });

        const connection = await pool.getConnection();
        let oldUser = await connection.query('SELECT * FROM admins WHERE username = ?', [username]);

        if (oldUser[0][0])
            res.status(409).json({ message: 'User with specified username already exists' });

        let encryptedPassword = await bcrypt.hash(password, 10);
        let token = jwt.sign({ username }, process.env.TOKEN_KEY, { expiresIn: '2h' });

        await connection.query('INSERT INTO admins (username, password, token) VALUES (?, ?)', [
            username,
            encryptedPassword
        ]);

        connection.release();
        res.status(201).json({
            message: 'Admin account created successfully',
            user: { username, password },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
