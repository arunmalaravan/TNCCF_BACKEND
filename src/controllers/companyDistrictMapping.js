const { pool } = require('../config/db.js');

// Create Company-District mapping function
const createCompanyDistrictMapping = async (req, res) => {
    const { company_id, district_id } = req.body;

    try {
        // Ensure that district_id is an array
        if (!Array.isArray(district_id)) {
            return res.status(400).json({ message: 'district_id must be an array' });
        }

        // Using map to process all district_ids asynchronously
        const promises = district_id.map(async (district) => {
            // 1. Check if the mapping already exists for the specific company and district
            const checkQuery = 'SELECT * FROM company_district_mapping WHERE company_id = ? AND district_id = ?';
            const checkValues = [company_id, district];
            const [existingMapping] = await pool.execute(checkQuery, checkValues);

            if (existingMapping.length > 0) {
                return; // Skip if the mapping already exists for this district
            }

            // 2. Insert the new company-district mapping into the database
            const insertQuery = 'INSERT INTO company_district_mapping (company_id, district_id) VALUES (?, ?)';
            const insertValues = [company_id, district];
            await pool.execute(insertQuery, insertValues);
        });

        // Wait for all insertions to complete
        await Promise.all(promises);

        res.status(201).json({ message: 'Company-District mappings created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getAllCompanyDistrictMappings = async (req, res) => {
    try {
        const query = `
            SELECT 
                cdm.company_id, 
                c.company_name, 
                cdm.district_id, 
                d.district_name
            FROM 
                company_district_mapping cdm
            JOIN 
                company c ON cdm.company_id = c.company_id
            JOIN 
                district d ON cdm.district_id = d.district_id
        `;

        const [mappings] = await pool.execute(query);

        // Group the results by company_id
        const groupedMappings = mappings.reduce((result, mapping) => {
            // If company doesn't exist in the result, add it
            if (!result[mapping.company_id]) {
                result[mapping.company_id] = {
                    company_id: mapping.company_id,
                    company_name: mapping.company_name,
                    districts: []
                };
            }

            // Push district details to the company's district list
            result[mapping.company_id].districts.push({
                district_id: mapping.district_id,
                district_name: mapping.district_name
            });

            return result;
        }, {});

        // Convert the grouped result to an array
        const finalResult = Object.values(groupedMappings);

        // Send the grouped response
        res.status(200).json(finalResult);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Delete a company-district mapping by company ID and district ID
const deleteCompanyDistrictMapping = async (req, res) => {
    const { company_id, district_id } = req.query;
    const companyId = Number(company_id);
    const districtId = Number(district_id);
    try {
        const query = 'DELETE FROM company_district_mapping WHERE company_id = ? AND district_id = ?';
        const values = [companyId, districtId];

        const [result] = await pool.execute(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.status(200).json({ message: 'Company-District mapping deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
module.exports = {
    createCompanyDistrictMapping,
    getAllCompanyDistrictMappings,
    deleteCompanyDistrictMapping,
};
