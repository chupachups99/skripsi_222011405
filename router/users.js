const express = require('express');

const UserController = require('../controller/users.js');
const router = express.Router();
function isAuthenticated(req, res, next) {
    // Check if user is authenticated
    // console.log(req.session);
    try{
        if (req.session.passport.user) {

            // User is authenticated, proceed to the next middleware/route handler
            console.log(req.session.passport.user);
            return next();
        }
    }
    catch(err){
        res.json({message:"Unauthorized"})
    }
    
    // return next();
}
router.use(isAuthenticated);

// Apply the isAuthenticated middleware to all routes within the router
// router.use(isAuthenticated);
// const router = express.Router();
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