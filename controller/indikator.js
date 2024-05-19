const IndexModel = require('../models/indikator.js');
const coordList = require('../assets/regencies.json');
var countries = require("i18n-iso-countries");
const https = require('https');
// console.log("Singapura => " + countries.getAlpha2Code("Malaysia", "id"));

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

const getDataWisman = async (req, res) => {
    try {
        const result = await fetch('https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/272/key/cf78d9c72e168bfe677972ba792787af');
        const kunjungan = await fetch('https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1470/key/cf78d9c72e168bfe677972ba792787af');

        const users = await result.json();
        const visits = await kunjungan.json();
        const negara = users.vervar;
        var iso_name = {
            "1": "Brunei"
            , "8": "Cambodia"
            , "9": "Myanmar"
            , "18": "Sri Lanka"
            , "22": "Afghanistan"
            , "26": "Kyrgyzstan"
            , "27": "North Korea"
            , "33": "Tajikistan"
            , "36": "Turkey"
            , "45": "United Arab Emirates"
            , "46": "Yemen"
            , "49": "Iraq"
            , "55": "Palestine"
            , "56": "Syria"
            , "64": "Italy"
            , "115": "Greece"
            , "76": "Iceland"
            , "77": "Ireland"
            , "79": "Luxembourg"
            , "87": "Russia"
            , "93": "Bosnia and Herzegovina"
            , "95": "Czech Rep."
            , "96": "Croatia"
            , "100": "Hungary"
            , "105": "Poland"
            , "117": "United States"
            , "121": "Costa Rica"
            , "130": "Brazil"
            , "131": "Chile"
            , "132": "Ecuador"
            , "136": "Colombia"
            , "143": "Antigua and Barbuda"
            , "147": "Bahamas"
            , "149": "Dominican Republic"
            , "150": "Grenada"
            , "153": "Jamaica"
            , "154": "Cuba"
            , "156": "Mexico"
            , "161": "Saint Vincent and the Grenadines"
            , "162": "Trinidad and Tobago"
            , "169": "Fiji"
            , "171": "New Caledonia"
            , "172": "Kiribati"
            , "174": "Micronesia"
            , "177": "Palau"
            , "190": "Central Africa Rep."
            , "191": "Aljazair"
            , "194": "Botswana"
            , "214": "Cameroon"
            , "219": "Madagascar"
            , "222": "Morocco"
            , "226": "Mozambique"
            , "231": "West Sahara"
            , "235": "Sierra Leone"
            , "148": "Dominica"
            , "180": "American Samoa"
        }
        var predef_id = {
            "12": "LKA",
            "14": "CHN",
            "24": "PRT",
            "25": "SWE",
            "27": "GBR"
        }
        // var id_negara=[];
        for (let i = 0; i < negara.length; i++) {
            let str = negara[i].label;
            let kode = negara[i].val;
            // let set_arr = new Object();
            if (countries.getAlpha3Code(str, "id")) {
                predef_id[kode] = countries.getAlpha3Code(str, "id");
                // id_negara.push(set_arr);
            }


        }
        res.json({
            biaya: users,
            kunjungan: visits,
            id: predef_id,
            iso:iso_name
        });

    }
    catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}


module.exports = {
    getAllData,
    getDataWisman

}