const { pool } = require('../config/db.js');

// Create Scheme function
const createScheme = async (req, res) => {
    const { scheme_name, is_active } = req.body;

    try {
        // 1. Check if the scheme name already exists
        const nameQuery = 'SELECT * FROM scheme WHERE scheme_name = ?';
        const nameValues = [scheme_name];
        const [existingSchemeName] = await pool.execute(nameQuery, nameValues);
        if (existingSchemeName.length > 0) {
            return res.status(400).json({ message: 'Scheme name is already taken' });
        }

        // 2. Insert the new scheme into the database
        const insertQuery = 'INSERT INTO scheme (scheme_name, is_active) VALUES (?, ?)';
        const insertValues = [scheme_name, is_active];
        const [result] = await pool.execute(insertQuery, insertValues);

        res.status(201).json({ message: 'Scheme created successfully', schemeId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all schemes
const getAllSchemes = async (req, res) => {
    try {
        const query = 'SELECT * FROM scheme';
        const [schemes] = await pool.execute(query);
        res.status(200).json(schemes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a scheme by ID
const getSchemeById = async (req, res) => {
    const { scheme_id } = req.params;
    console.log(scheme_id)

    try {
        const query = 'SELECT * FROM scheme WHERE scheme_id = ?';
        const value = [scheme_id];

        const [scheme] = await pool.execute(query, value);
        if (scheme.length === 0) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        res.status(200).json(scheme[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a scheme by ID
const updateScheme = async (req, res) => {
    const { scheme_id, scheme_name, is_active } = req.body;

    try {
        // 1. Check if the scheme name already exists (excluding the current scheme)
        const nameQuery = 'SELECT * FROM scheme WHERE scheme_name = ? AND scheme_id != ?';
        const nameValues = [scheme_name, scheme_id];
        const [existingSchemeName] = await pool.execute(nameQuery, nameValues);
        if (existingSchemeName.length > 0) {
            return res.status(400).json({ message: 'Scheme name is already taken by another scheme' });
        }

        const query = 'UPDATE scheme SET scheme_name = ?, is_active = ? WHERE scheme_id = ?';
        const value = [scheme_name, is_active, scheme_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        res.status(200).json({ message: 'Scheme updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a scheme by ID
const deleteScheme = async (req, res) => {
    const { scheme_id } = req.params;
    try {
        const query = 'DELETE FROM scheme WHERE scheme_id = ?';
        const value = [scheme_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        res.status(200).json({ message: 'Scheme deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createScheme,
    getAllSchemes,
    getSchemeById,
    updateScheme,
    deleteScheme,
};
