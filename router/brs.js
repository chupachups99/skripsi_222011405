const express = require('express');
// Define your router
const router = express.Router();
const BrsController = require('../controller/brs.js');
const dbConn = require('../config/db.js');
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
router.get('/', BrsController.getAllData);
router.post('/', BrsController.updateData);
router.post('/insert', BrsController.insertData);




module.exports = router;