const { pool } = require('../config/db.js');

// Create User function
const createUser = async (req, res) => {
    const { first_name, last_name, email, phone_number, password, is_active } = req.body;

    try {
        // 1. Check if the email already exists
        const emailQuery = 'SELECT * FROM user WHERE email = ?';
        const emailValues = [email];
        const [existingEmail] = await pool.execute(emailQuery, emailValues);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        // 2. Check if the phone number already exists
        const phoneQuery = 'SELECT * FROM user WHERE phone_number = ?';
        const phoneValues = [phone_number];
        const [existingPhoneNumber] = await pool.execute(phoneQuery, phoneValues);
        if (existingPhoneNumber.length > 0) {
            return res.status(400).json({ message: 'Phone number is already taken' });
        }

        // 3. Insert the new user into the database
        const insertQuery = 'INSERT INTO user (first_name, last_name, email, phone_number, password, is_active) VALUES (?, ?, ?, ?, ?, ?)';
        const insertValues = [first_name, last_name, email, phone_number, password, is_active];
        const [result] = await pool.execute(insertQuery, insertValues);

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get all users
const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM user';
        const [users] = await pool.execute(query);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    const { user_id } = req.params;

    try {
        const query = 'SELECT * FROM user WHERE user_id = ?';
        const value = [user_id];

        const [user] = await pool.execute(query, value);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    const { user_id, first_name, last_name, email, phone_number, is_active } = req.body;

    try {
        // 1. Check if the email already exists (excluding the current user)
        const emailQuery = 'SELECT * FROM user WHERE email = ? AND user_id != ?';
        const emailValues = [email, user_id];
        const [existingEmail] = await pool.execute(emailQuery, emailValues);
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email is already taken by another user' });
        }

        // 2. Check if the phone number already exists (excluding the current user)
        const phoneQuery = 'SELECT * FROM user WHERE phone_number = ? AND user_id != ?';
        const phoneValues = [phone_number, user_id];
        const [existingPhoneNumber] = await pool.execute(phoneQuery, phoneValues);
        if (existingPhoneNumber.length > 0) {
            return res.status(400).json({ message: 'Phone number is already taken by another user' });
        }
        const query = 'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone_number = ?, is_active = ? WHERE user_id = ?';
        const value = [first_name, last_name, email, phone_number, is_active, user_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const query = 'DELETE FROM user WHERE user_id = ?';
        const value = [user_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
