const express = require('express');
const {
    createCompanyDistrictMapping,
    getAllCompanyDistrictMappings,
    deleteCompanyDistrictMapping,
} = require('../controllers/companyDistrictMapping.js');

const companyDistrictMappingRouter = express.Router();


// Routes for company-district mappings
companyDistrictMappingRouter.post('/', createCompanyDistrictMapping);
companyDistrictMappingRouter.get('/', getAllCompanyDistrictMappings);
companyDistrictMappingRouter.delete('/', deleteCompanyDistrictMapping);

module.exports = companyDistrictMappingRouter;
