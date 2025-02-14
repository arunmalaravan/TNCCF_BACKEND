const express = require('express');
const {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser,
    getUserById
} = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.post('/', createUser);      // Create user
userRouter.get('/', getAllUsers);     // Get all users
userRouter.get('/:user_id', getUserById);  // Get user by ID
userRouter.put('/', updateUser);   // Update user by ID
userRouter.delete('/:user_id', deleteUser); // Delete user by ID

module.exports = userRouter;
