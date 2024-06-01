const express = require('express');

const tabulasiController = require('../controller/tabulasi.js');

const router = express.Router();
// const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const app = express();
// const PORT = 3000;

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up multer storage and filename settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// const dbConn = require('../config/db.js');
// CREATE - POST
// router.post('/', IndexController.createNewUser);

// index
router.get('/', tabulasiController.indexPage);
//crossTab
router.post('/crosstab', tabulasiController.getCrossTab);
router.post('/uploadData', upload.single('file'), tabulasiController.uploadCSV);

// router.post('/insert',BrsController.insertData);

// UPDATE - PATCH
// router.patch('/:idUser', UserController.updateUser);

// DELETE - DELETE
// router.delete('/:idUser', UserController.deleteUser);



module.exports = router;