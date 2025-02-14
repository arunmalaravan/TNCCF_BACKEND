const { pool } = require('../config/db.js');

// Create Company function
const createCompany = async (req, res) => {
    const { company_name, is_active } = req.body;

    try {
        // 1. Check if the company name already exists
        const nameQuery = 'SELECT * FROM company WHERE company_name = ?';
        const nameValues = [company_name];
        const [existingCompanyName] = await pool.execute(nameQuery, nameValues);
        if (existingCompanyName.length > 0) {
            return res.status(400).json({ message: 'Company name is already taken' });
        }

        // 2. Insert the new company into the database
        const insertQuery = 'INSERT INTO company (company_name, is_active) VALUES (?, ?)';
        const insertValues = [company_name, is_active];
        const [result] = await pool.execute(insertQuery, insertValues);

        res.status(201).json({ message: 'Company created successfully', companyId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const query = 'SELECT * FROM company';
        const [companies] = await pool.execute(query);
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a company by ID
const getCompanyById = async (req, res) => {
    const { company_id } = req.params;

    try {
        const query = 'SELECT * FROM company WHERE company_id = ?';
        const value = [company_id];

        const [company] = await pool.execute(query, value);
        if (company.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(company[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a company by ID
const updateCompany = async (req, res) => {
    const { company_id, company_name, is_active } = req.body;

    try {
        // 1. Check if the company name already exists (excluding the current company)
        const nameQuery = 'SELECT * FROM company WHERE company_name = ? AND company_id != ?';
        const nameValues = [company_name, company_id];
        const [existingCompanyName] = await pool.execute(nameQuery, nameValues);
        if (existingCompanyName.length > 0) {
            return res.status(400).json({ message: 'Company name is already taken by another company' });
        }

        const query = 'UPDATE company SET company_name = ?, is_active = ? WHERE company_id = ?';
        const value = [company_name, is_active, company_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({ message: 'Company updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a company by ID
const deleteCompany = async (req, res) => {
    const { company_id } = req.params;
    try {
        const query = 'DELETE FROM company WHERE company_id = ?';
        const value = [company_id];

        const [result] = await pool.execute(query, value);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFilteredCompanyDistricts = async (req, res) => {
    let { company_id, district_id } = req.query;  // Get parameters from query
    console.log(req.query);

    // Convert 'null' string to actual null
    if (company_id === 'null') company_id = null;
    if (district_id === 'null') district_id = null;

    try {
        let query = `
            SELECT 
                d.district_id, d.district_name, c.company_id, c.company_name
            FROM 
                company_district_mapping cdm 
            JOIN 
                district d ON d.district_id = cdm.district_id
            JOIN 
                company c ON c.company_id = cdm.company_id
            WHERE 
                c.is_active = TRUE AND d.is_active = TRUE`;

        // If company_id is provided, filter the districts
        if (company_id) {
            query += ` AND c.company_id = ${company_id}`;
        }

        // If district_id is provided, filter the companies
        if (district_id) {
            query += ` AND d.district_id = ${district_id}`;
        }

        // Execute the combined query
        const [companyDistricts] = await pool.execute(query);

        // Remove duplicates from companies based on company_id
        const companies = companyDistricts.reduce((acc, item) => {
            if (!acc.some(company => company.company_id === item.company_id)) {
                acc.push({
                    company_id: item.company_id,
                    company_name: item.company_name
                });
            }
            return acc;
        }, []);

        // Remove duplicates from districts based on district_id
        const districts = companyDistricts.reduce((acc, item) => {
            if (!acc.some(district => district.district_id === item.district_id)) {
                acc.push({
                    district_id: item.district_id,
                    district_name: item.district_name
                });
            }
            return acc;
        }, []);

        res.status(200).json({ companies, districts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getFilteredCompanyDistricts
};
