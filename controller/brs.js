const BrsModel = require('../models/brs.js');
// const coordList = require('../assets/regencies.json');

const getAllData = async (req, res) => {
    try {
        // console.log(req.);
        const brs= await BrsModel.getAllData();
        // let temp = brs[0].filter(a => a.id == 24);
        // res.status(200).json({
        //     data:temp
        // })
        res.render("brs",{
            message: 'GET all data success',
            data :brs[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}
const updateData = async(req,res)=>{
    const {body} = req;
    try{
        const brs = await BrsModel.updateData(body);
        res.redirect("/");
    }
    catch(error){
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
        // alert(error);
    }
}
const insertData = async(req,res)=>{
    const {body} = req;
    try{
        const brs = await BrsModel.insertData(body);
        res.redirect("/");
        
    }
    catch(error){
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
        // alert(error);
    }
}

module.exports = {
    getAllData,
    updateData,
    insertData

}