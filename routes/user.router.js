const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  createUser,
  getUserById
} = require('../controller/user.controller');

// access routes
router.get('/get-all-users', getAllUsers);
router.get('/get/:name', getUserById);
router.post('/create-user', createUser);

module.exports = router;
