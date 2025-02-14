const express = require('express');
const {
    createScheme,
    getAllSchemes,
    getSchemeById,
    updateScheme,
    deleteScheme,
} = require('../controllers/schemeController.js');

const schemeRouter = express.Router();

// Routes for Scheme operations
schemeRouter.post('/', createScheme);                 // Create Scheme
schemeRouter.get('/', getAllSchemes);                // Get All Schemes
schemeRouter.get('/:scheme_id', getSchemeById);             // Get Scheme by ID
schemeRouter.put('/', updateScheme);                  // Update Scheme
schemeRouter.delete('/:scheme_id', deleteScheme);           // Delete Scheme

module.exports = schemeRouter;
