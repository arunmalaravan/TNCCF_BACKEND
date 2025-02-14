const { pool } = require('../config/db.js');

// Create District function
const createDistrict = async (req, res) => {
    const { district_name, is_active } = req.body;

    try {
        // 1. Check if the district name already exists
        const nameQuery = 'SELECT * FROM district WHERE district_name = ?';
        const nameValues = [district_name];
        const [existingDistrictName] = await pool.execute(nameQuery, nameValues);
        if (existingDistrictName.length > 0) {
            return res.status(400).json({ message: 'District name is already taken' });
        }

        // 2. Insert the new district into the database
        const insertQuery = 'INSERT INTO district (district_name, is_active) VALUES (?, ?)';
        const insertValues = [district_name, is_active];
        const [result] = await pool.execute(insertQuery, insertValues);

        res.status(201).json({ message: 'District created successfully', districtId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all districts
const getAllDistricts = async (req, res) => {
    try {
        const query = 'SELECT * FROM district';
        const [districts] = await pool.execute(query);
        res.status(200).json(districts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a district by ID
const getDistrictById = async (req, res) => {
    const { district_id } = req.params;

    try {
        const query = 'SELECT * FROM district WHERE district_id = ?';
        const value = [district_id];

        const [district] = await pool.execute(query, value);
        if (district.length === 0) {
            return res.status(404).json({ message: 'District not found' });
        }

        res.status(200).json(district[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a district by ID
const updateDistrict = async (req, res) => {
    const { district_id, district_name, is_active } = req.body;

    try {
        // 1. Check if the district name already exists (excluding the current district)
        const nameQuery = 'SELECT * FROM district WHERE district_name = ? AND district_id != ?';
        const nameValues = [district_name, district_id];
        const [existingDistrictName] = await pool.execute(nameQuery, nameValues);
        if (existingDistrictName.length > 0) {
            return res.status(400).json({ message: 'District name is already taken by another district' });
        }

        const query = 'UPDATE district SET district_name = ?, is_active = ? WHERE district_id = ?';
        const value = [district_name, is_active, district_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'District not found' });
        }

        res.status(200).json({ message: 'District updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a district by ID
const deleteDistrict = async (req, res) => {
    const { district_id } = req.params;
    try {
        const query = 'DELETE FROM district WHERE district_id = ?';
        const value = [district_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'District not found' });
        }

        res.status(200).json({ message: 'District deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createDistrict,
    getAllDistricts,
    getDistrictById,
    updateDistrict,
    deleteDistrict,
};
