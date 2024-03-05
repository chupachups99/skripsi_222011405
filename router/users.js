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
// CHECK - POST
// router.post('/auth',function());

// '/api/login' route
// router.route('/auth').post(
//   // Using local strategy to redirect back to the signin page if there is an error
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login'
//   }
//   (req, res) => {
//     console.log('req.sessionID: ', req.sessionID)
//     res.status(200).json({ user: req.user })
//   }
// )

// UPDATE - PATCH
router.patch('/:idUser', UserController.updateUser);

// DELETE - DELETE
router.delete('/:idUser', UserController.deleteUser);



module.exports = router;