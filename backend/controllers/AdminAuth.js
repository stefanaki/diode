const pool = require('./../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password))
            return res.status(400).json({ message: 'Username and password required' });

        const connection = await pool.getConnection();
        let user = await connection.query('SELECT * FROM admins where username = ?', [username]);
        connection.release();

        if (!user[0][0]) return res.status(404).json({ message: 'Invalid credentials' });

        if (await bcrypt.compare(password, user[0][0].password)) {
            let token = jwt.sign({ username }, process.env.TOKEN_KEY, { expiresIn: '2h' });
            return res.status(200).json({ message: 'Log in successful', token });
        } else {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const Logout = async (req, res) => {
    try {
        const token = req.header('X-OBSERVATORY-AUTH');
        if (!token) return res.status(403).json({ message: 'Authentication token required' });

        await redisClient.rPush('blacklisted_tokens', token);
        res.status(200).json({ message: 'Log out successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const Register = async (req, res) => {
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

module.exports = { Login, Logout, Register };
