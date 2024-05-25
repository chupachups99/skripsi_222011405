const express = require('express');

const tabulasiController = require('../controller/tabulasi.js');

const router = express.Router();
// const dbConn = require('../config/db.js');
// CREATE - POST
// router.post('/', IndexController.createNewUser);

// index
router.get('/', tabulasiController.indexPage);
//crossTab
router.post('/crosstab', tabulasiController.getCrossTab);
// router.post('/insert',BrsController.insertData);

// UPDATE - PATCH
// router.patch('/:idUser', UserController.updateUser);

// DELETE - DELETE
// router.delete('/:idUser', UserController.deleteUser);



module.exports = router;