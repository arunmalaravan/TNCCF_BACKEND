const { pool } = require('../config/db.js');

// Create Amount function
const createAmount = async (req, res) => {
    const { scheme_id, district_id, company_id, amount } = req.body;

    try {
        // 1. Check if the combination of scheme_id, district_id, and company_id already exists
        const checkQuery = 'SELECT * FROM amount WHERE scheme_id = ? AND district_id = ? AND company_id = ?';
        const checkValues = [scheme_id, district_id, company_id];
        const [existingAmount] = await pool.execute(checkQuery, checkValues);
        if (existingAmount.length > 0) {
            return res.status(400).json({ message: 'Amount entry for this combination already exists' });
        }

        // 2. Insert the new amount into the database
        const insertQuery = 'INSERT INTO amount (scheme_id, district_id, company_id, amount) VALUES (?, ?, ?, ?)';
        const insertValues = [scheme_id, district_id, company_id, amount];
        const [result] = await pool.execute(insertQuery, insertValues);

        res.status(201).json({ message: 'Amount created successfully', amountId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all amounts
const getAllAmounts = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.amount_id,
                a.amount,
                s.scheme_id,
                s.scheme_name,
                d.district_id,
                d.district_name,
                c.company_id,
                c.company_name
            FROM amount a
            JOIN scheme s ON a.scheme_id = s.scheme_id
            JOIN district d ON a.district_id = d.district_id
            JOIN company c ON a.company_id = c.company_id
            ORDER BY a.created_at DESC
        `;
        const [amounts] = await pool.execute(query);

        // Group amounts by scheme_id
        const groupedAmounts = amounts.reduce((acc, amount) => {
            const { scheme_id, scheme_name, company_id, company_name, district_id, district_name, amount: amt } = amount;

            // Check if the scheme already exists in the accumulator
            if (!acc[scheme_id]) {
                acc[scheme_id] = {
                    scheme_id,
                    scheme_name,
                    details: [] // All company, district, and amount will go here
                };
            }

            // Add combined company, district, and amount
            const scheme = acc[scheme_id];

            // Add unique entry combining company, district, and amount
            scheme.details.push({
                company_id,
                company_name,
                district_id,
                district_name,
                amount_id: amount.amount_id,
                amount: amt
            });

            return acc;
        }, {});

        // Convert the grouped object to an array of schemes
        const result = Object.values(groupedAmounts);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get an amount by ID
const getAmountById = async (req, res) => {
    const { amount_id } = req.params;

    try {
        const query = 'SELECT * FROM amount WHERE amount_id = ?';
        const value = [amount_id];

        const [amount] = await pool.execute(query, value);
        if (amount.length === 0) {
            return res.status(404).json({ message: 'Amount not found' });
        }

        res.status(200).json(amount[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an amount by ID
const updateAmount = async (req, res) => {
    const { amount_id, scheme_id, district_id, company_id, amount } = req.body;

    try {
        // 1. Check if the combination of scheme_id, district_id, and company_id already exists (excluding the current amount)
        const checkQuery = 'SELECT * FROM amount WHERE scheme_id = ? AND district_id = ? AND company_id = ? AND amount_id != ?';
        const checkValues = [scheme_id, district_id, company_id, amount_id];
        const [existingAmount] = await pool.execute(checkQuery, checkValues);
        if (existingAmount.length > 0) {
            return res.status(400).json({ message: 'Amount entry for this combination already exists' });
        }

        const query = 'UPDATE amount SET scheme_id = ?, district_id = ?, company_id = ?, amount = ? WHERE amount_id = ?';
        const value = [scheme_id, district_id, company_id, amount, amount_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Amount not found' });
        }

        res.status(200).json({ message: 'Amount updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete an amount by ID
const deleteAmount = async (req, res) => {
    const { amount_id } = req.params;
    try {
        const query = 'DELETE FROM amount WHERE amount_id = ?';
        const value = [amount_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Amount not found' });
        }

        res.status(200).json({ message: 'Amount deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createAmount,
    getAllAmounts,
    getAmountById,
    updateAmount,
    deleteAmount,
};
