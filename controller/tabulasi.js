const tabModel = require('../models/tabulasi.js');
// const coordList = require('../assets/regencies.json');

const indexPage = async(req,res)=>{
    try{
        const tahun = await tabModel.getTahun();
        console.log(tahun[0]);
        res.render("tabulasi", {data:tahun[0]})
    }
    catch(error){
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })

    }
}
const getCrossTab = async(req,res)=>{
    const {body} = req;
    // console.log(body);
    let arr;
    if(body.group){
        arr = await tabModel.getGroup({columns:body.group});
        body["listgroup"]=arr[0];
    }
    
    try{
        let data = await tabModel.getAllData(body);
        let columns=[];
        // console.log(data[0]);
        for(let i=0;i<Object.keys(data[0][1]).length;i++){
            columns.push({data:Object.keys(data[0][1])[i]});
        }
        res.send({
            data:data[0],
            columns:columns,
        })
        

    }
    catch(error){

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
 getCrossTab

}