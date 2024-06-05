const express = require('express');

const tabulasiController = require('../controller/tabulasi.js');
// const express = require('express');


// Define your router
const router = express.Router();

// Apply the isAuthenticated middleware to all routes within the router
// router.use(isAuthenticated);
// const router = express.Router();
const path = require('path');

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
router.get('/', tabulasiController.indexPage);
//crossTab
router.post('/crosstab', tabulasiController.getCrossTab);
router.post('/uploadData', tabulasiController.uploadCSV);

// router.post('/insert',BrsController.insertData);

// UPDATE - PATCH
// router.patch('/:idUser', UserController.updateUser);

// DELETE - DELETE
// router.delete('/:idUser', UserController.deleteUser);



module.exports = router;