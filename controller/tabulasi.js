const tabModel = require('../models/tabulasi.js');
const CsvInsert = require("mysql-insert-csv");
// const coordList = require('../assets/regencies.json');

const indexPage = async (req, res) => {
    try {
        const tahun = await tabModel.getTahun();
        console.log(tahun[0]);
        res.render("tabulasi", { data: tahun[0] })
    }
    catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })

    }
}
const getCrossTab = async (req, res) => {
    const { body } = req;
    // console.log(body);
    let arr = [];
    let span;
    let temp = [];
    if (body.group) {
        arr = await tabModel.getGroup({ columns: body.group });
        // span =await tabModel.getGroupData({columns:body.group});
        // for(let j=0;j<span[0].length;j++){
        //     temp.push(Object.values(span[0][j].spliced(0,span[0].length/2-1)));
        // }

        // // console.log(arr);
        body["listgroup"] = arr[0];
    }
    // console.log(arr[0]);

    try {
        let data = await tabModel.getAllData(body);
        let columns = [];
        // console.log(data[0]);
        for (let i = 0; i < Object.keys(data[0][1]).length; i++) {
            columns.push({ data: Object.keys(data[0][1])[i] });
        }
        res.send({
            data: data[0],
            columns: columns,
            matrix: arr[0],

        })


    }
    catch (error) {

    }
}

const XLSX = require('xlsx');
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');

function convertExcelToCsv(inputFile, outputFile) {
    // Read the Excel file
    const workbook = XLSX.readFile(inputFile);

    // Assuming you want to convert the first sheet only
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet to CSV
    const csvData = XLSX.utils.sheet_to_csv(worksheet);

    // Write the CSV data to a file
    fs.writeFileSync(outputFile, csvData, 'utf8');

    console.log(`Converted ${inputFile} to ${outputFile}`);
}


const uploadCSV = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }
        let nameFile = file.destination+'/'+file.filename;
        if (file.mimetype == "application/vnd.ms-excel" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            console.log('xls');
            // Example usage
            const inputFile = file.destination+'/'+file.filename;
            nameFile = file.destination+'/'+file.filename.split('.')[0]+'.csv';
            convertExcelToCsv(inputFile, nameFile);
        }
        

        let json = csvToJson.getJsonFromCsv(nameFile);
        let data = await tabModel.insertData({data:json});    
        console.log(data);
        // Respond to the client
        res.status(200).send({message:data});

    }
    catch (err) {
        // console.log(err);
        res.status(500).send('File uploaded failed')

    }
}



// const getAllData = async (req, res) => {
//     try {
//         const brs= await BrsModel.getAllData();
//         // let temp = brs[0].filter(a => a.id == 24);
//         // res.status(200).json({
//         //     data:temp
//         // })
//         res.render("brs",{
//             message: 'GET all data success',
//             data :brs[0]
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'Server Error',
//             serverMessage: error,
//         })
//     }
// }
// const updateData = async(req,res)=>{
//     const {body} = req;
//     try{
//         const brs = await BrsModel.updateData(body);
//         res.redirect("/");
//     }
//     catch(error){
//         res.status(500).json({
//             message: 'Server Error',
//             serverMessage: error,
//         })
//         // alert(error);
//     }
// }
// const insertData = async(req,res)=>{
//     const {body} = req;
//     try{
//         const brs = await BrsModel.insertData(body);
//         res.redirect("/");

//     }
//     catch(error){
//         res.status(500).json({
//             message: 'Server Error',
//             serverMessage: error,
//         })
//         // alert(error);
//     }
// }

module.exports = {
    indexPage,
    getCrossTab,
    uploadCSV

}