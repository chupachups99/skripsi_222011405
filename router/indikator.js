const express = require('express');

const IndexController = require('../controller/indikator.js');

const router = express.Router();
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