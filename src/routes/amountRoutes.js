const express = require('express');
const {
    createAmount,
    getAllAmounts,
    getAmountById,
    updateAmount,
    deleteAmount
} = require('../controllers/amountController.js');

const amountRouter = express.Router();

amountRouter.post('/', createAmount);
amountRouter.get('/', getAllAmounts);
amountRouter.get('/:amount_id', getAmountById);
amountRouter.put('/', updateAmount);
amountRouter.delete('/:amount_id', deleteAmount);

module.exports = amountRouter;
