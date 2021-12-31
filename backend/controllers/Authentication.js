const pool = require('./../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const sendResponse = require('../utilities/sendFormattedResponse');

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password))
            return sendResponse(req, res, 400, { message: 'Username and password required' });

        const connection = await pool.getConnection();
        let user = await connection.query('SELECT * FROM users where username = ?', [username]);
        connection.release();

        if (!user[0][0]) return sendResponse(req, res, 401, { message: 'Invalid credentials' });
        else if (user[0][0].status === 'inactive')
            return sendResponse(req, res, 401, { message: 'Inactive user account' });

        if (await bcrypt.compare(password, user[0][0].password)) {
            let token = jwt.sign(
                { id: user[0][0].id, username: user[0][0].username, type: user[0][0].type },
                process.env.TOKEN_KEY,
                { expiresIn: '2h' }
            );
            return sendResponse(req, res, 200, { message: 'Log in successful', token });
        } else {
            return sendResponse(req, res, 400, { message: 'Invalid credentials' });
        }
    } catch (error) {
        return sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};

const Logout = async (req, res) => {
    try {
        const token = req.header('X-OBSERVATORY-AUTH');
        if (!token)
            return sendResponse(req, res, 403, { message: 'Authentication token required' });

        await redisClient.rPush('blacklisted_tokens', token);
        console.log('token added to redis');
        sendResponse(req, res, 200, { message: 'Log out successful' });
    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};

module.exports = { Login, Logout };
