const pool = require('./../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {
        const { username, password, type } = req.body;

        if (!(username && password))
            return res.status(400).json({ message: 'Username and password required' });

        const connection = await pool.getConnection();
        let oldUser = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

        if (oldUser[0][0])
            res.status(409).json({ message: 'User with specified username already exists' });

        let encryptedPassword = await bcrypt.hash(password, 10);
        let token = jwt.sign({ username }, process.env.TOKEN_KEY, { expiresIn: '2h' });

        await connection.query('INSERT INTO users (username, password, type) VALUES (?, ?, ?)', [
            username,
            encryptedPassword,
            type
        ]);

        connection.release();
        res.status(201).json({
            message: 'User created successfully',
            user: { username, password },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
