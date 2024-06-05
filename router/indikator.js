const express = require('express');

const IndexController = require('../controller/indikator.js');

// Define your router
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
const dbConn = require('../config/db.js');
// CREATE - POST
// router.post('/', IndexController.createNewUser);

// READ - GET
router.get('/', IndexController.getAllData);
router.get('/dataWisman', IndexController.getDataWisman);

// UPDATE - PATCH
// router.patch('/:idUser', UserController.updateUser);

// DELETE - DELETE
// router.delete('/:idUser', UserController.deleteUser);



module.exports = router;