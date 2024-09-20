import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { queryDatabase } from '../utilities/queryDatabase.js';

dotenv.config();

export async function register(req, res) {
    const { first_name, last_name, email, password, phone, dob, gender, address } = req.body;

    try {
        const result = await queryDatabase('SELECT email FROM user WHERE email = ? OR phone = ?', [email, phone]);

        if (result.length > 0) {
            return res.status(400).json({ email: 'Duplicate email or phone number' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await queryDatabase('INSERT INTO user (first_name, last_name, email, password, phone, dob, gender, role, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, phone, dob, gender, 'super_admin', address]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function login(req, res) {
    const { email, password, remember } = req.body;

    try {
        const results = await queryDatabase('SELECT * FROM user WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(400).json({ email: 'Invalid email address' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ password: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: remember ? '30d' : '24h' }
        );
        let resUser = {first_name : user?.first_name, last_name: user?.last_name, phone: user?.phone, dob : new Date(user?.dob).toISOString().split('T')[0], address: user?.address, gender: user?.gender, role: user?.role}

        res.status(200).json({
            message: 'Login successful',
            token,
            user: resUser
        });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function me(req, res) {
    const {id} = req.user;
    const results = await queryDatabase('SELECT * FROM user WHERE id = ?', [id]);

    const user = results[0];
    let resUser = {id:user?.id, first_name : user?.first_name, last_name: user?.last_name,email:user?.email, phone: user?.phone, dob : new Date(user?.dob), address: user?.address, gender: user?.gender, role: user?.role}
    res.status(200).json({ message: 'Profile Details Listed Successfully!', user: resUser });
}