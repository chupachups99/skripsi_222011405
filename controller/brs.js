const BrsModel = require('../models/brs.js');
// const coordList = require('../assets/regencies.json');

const getAllData = async (req, res) => {
    try {
        const brs= await BrsModel.getAllData();
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
        // ('Saved');
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
    updateData

}