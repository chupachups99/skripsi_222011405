const IndexModel = require('../models/indikator.js');

const getAllData = async(req, res) => {
    try {
        const data =await IndexModel.getAllData();

        res.json({
            message: 'GET all data success',
            database: data,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}


module.exports = {
    getAllData

}