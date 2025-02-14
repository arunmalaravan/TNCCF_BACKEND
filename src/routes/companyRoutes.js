const express = require('express');
const {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getFilteredCompanyDistricts
} = require('../controllers/companyController.js');

const companyRouter = express.Router();

companyRouter.post('/', createCompany);
companyRouter.get('/', getAllCompanies);
companyRouter.get('/:company_id', getCompanyById);
companyRouter.put('/', updateCompany);
companyRouter.delete('/:company_id', deleteCompany);
companyRouter.get('/filter/companies-districts', getFilteredCompanyDistricts);

module.exports = companyRouter;
