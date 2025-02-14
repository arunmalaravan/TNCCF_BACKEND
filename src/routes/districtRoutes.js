const express = require('express');
const {
    createDistrict,
    getAllDistricts,
    getDistrictById,
    updateDistrict,
    deleteDistrict
} = require('../controllers/districtController.js');

const districtRouter = express.Router();

districtRouter.post('/', createDistrict);
districtRouter.get('/', getAllDistricts);
districtRouter.get('/:district_id', getDistrictById);
districtRouter.put('/', updateDistrict);
districtRouter.delete('/:district_id', deleteDistrict);

module.exports = districtRouter;
