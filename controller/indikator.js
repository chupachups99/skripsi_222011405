const IndexModel = require('../models/indikator.js');
const coordList = require('../assets/regencies.json');

const getAllData = async (req, res) => {
    try {
        const data = await IndexModel.getAllData();
        const valueRow = data[0];
        const convertedData = [];
        const hiValue = [0, 0, 0, 0];
        const idxValue = [-1, -1, -1, -1];
        j = -1
        for (let i = 0; i < valueRow.length; i++) {
            let kode = valueRow[i].kode;
            let coord = coordList.filter(function (d) {
                return d["id"] === kode;
            });



            if (coord.length > 0) {
                convertedData.push({
                    name: coord[0].name,
                    value: [coord[0].longitude, coord[0].latitude, valueRow[i]["TNUS_"], valueRow[i]["TPK_"], valueRow[i]["TA_"], valueRow[i]["MKTS_"]]
                });
                j = j + 1;
                if (parseFloat(valueRow[i]["TNUS_"]) > hiValue[0]) {
                    idxValue[0] = j;
                    hiValue[0] = parseFloat(valueRow[i]["TNUS_"])
                }
                if (parseFloat(valueRow[i]["TPK_"]) > hiValue[1]) {
                    idxValue[1] = j;
                    hiValue[1] = parseFloat(valueRow[i]["TPK_"])
                }
                if (parseFloat(valueRow[i]["TA_"]) > hiValue[2]) {
                    idxValue[2] = j;
                    hiValue[2] = parseFloat(valueRow[i]["TA_"])
                }
                if (parseFloat(valueRow[i]["MKTS_"]) > hiValue[3]) {
                    idxValue[3] = j;
                    hiValue[3] = parseFloat(valueRow[i]["MKTS_"])
                }
            }

        }
        res.json({
            message: 'GET all data success',
            database: convertedData,
            index: idxValue
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