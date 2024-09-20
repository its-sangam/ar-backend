import { queryDatabase } from '../utilities/queryDatabase.js';
import bcrypt from 'bcrypt';

export async function listUsers(req, res) {
    try {
        const result = await queryDatabase(
            'SELECT id, first_name, last_name, email, phone, dob, gender, role, address FROM user'
        );

        res.status(200).json({ message: 'User Listed successfully', data:result });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function getUserDetails(req, res) {
    const { id } = req.params;

    try {
        const result = await queryDatabase('SELECT id, first_name, last_name, email, phone, dob, gender, role, address from user WHERE id = ?', [id]);

        if (result.length === 0) {
            return res.status(404).json({ email: 'User Not Found' });
        }

        const user = result[0];

        res.status(200).json({
            message: 'User Details fetched successfully!',
            data:user
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function store(req, res) {
    const { first_name, last_name, email, password, phone, dob, gender, address, role } = req.body;

    try {
        const result = await queryDatabase('SELECT email FROM user WHERE email = ? OR phone = ?', [email, phone]);

        if (result.length > 0) {
            return res.status(400).json({ email: 'Duplicate email or phone number' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await queryDatabase('INSERT INTO user (first_name, last_name, email, password, phone, dob, gender, role, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, phone, dob, gender, role, address]);

        //Create Artist from the user
        if(role === 'artist'){
            await queryDatabase(
                'INSERT INTO artist (name, dob, gender, address) VALUES (?, ?, ?, ?)',
                [first_name + ' ' + last_name, dob, gender, address]
            );
        }
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}


export async function update(req, res) {
    const { first_name, last_name, phone, dob, gender, address, role } = req.body;
    const { id } = req.params;

    try {
        const result = await queryDatabase('SELECT phone FROM user WHERE phone = ? AND id != ?', [phone, id]);

        if (result.length > 0) {
            return res.status(400).json({ phone: 'Phone number already used' });
        }

        await queryDatabase(
            'UPDATE user SET first_name = ?, last_name = ?, phone = ?, dob = ?, gender = ?, role = ?, address = ? WHERE id = ?', 
            [first_name, last_name, phone, dob, gender, role, address, id]
        );

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

export async function deleteUser(req, res) {
    const {id} = req.params;
    try {
        const result = await queryDatabase('DELETE FROM user WHERE id = ?', [parseInt(id)]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        res.status(200).json({
            message: 'User deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
