const express = require('express');

const tabulasiController = require('../controller/tabulasi.js');
// const express = require('express');
function isAuthenticated(req, res, next) {
    // Check if user is authenticated
    // if (req.user) {
    //     // User is authenticated, proceed to the next middleware/route handler
    //     return next();
    // } else {
    //     // User is not authenticated, handle accordingly
    //     return res.status(401).send('Unauthorized');
    // }
    return next();
}

// Define your router
const router = express.Router();

// Apply the isAuthenticated middleware to all routes within the router
router.use(isAuthenticated);
// const router = express.Router();
const path = require('path');


// const dbConn = require('../config/db.js');
// CREATE - POST
// router.post('/', IndexController.createNewUser);

// index
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