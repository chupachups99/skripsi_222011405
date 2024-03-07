const express = require('express');

const UserController = require('../controller/users.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const dbConn = require('../config/db.js');
// CREATE - POST
router.post('/', UserController.createNewUser);

// READ - GET
router.get('/', UserController.getAllUsers);

// UPDATE - PATCH
router.patch('/:idUser', UserController.updateUser);

// DELETE - DELETE
router.delete('/:idUser', UserController.deleteUser);



module.exports = router;