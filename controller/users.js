const UsersModel = require('../models/users.js');

const getAllUsers = async(req, res) => {
    try {
        const rows =await UsersModel.getAlluserid();

        res.send({
            message: 'GET all users success',
            data :rows[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error tes',
            serverMessage: error,
        })
    }
}

const createNewUser = async (req, res) => {
    const {body} = req;

    if(!body.email || !body.nama || !body.password){
        return res.status(400).json({
            message: 'Anda mengirimkan data yang salah',
            data: null,
        })
    }

    try {
        await UsersModel.createNewUser(body);
        // res.status(201).json({
        //     message: 'CREATE new user success',
        //     data: body
        // });
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}

const updateUser = async (req, res) => {
    const {idUser} = req.params;
    const {body} = req;
    try {
        await UsersModel.updateUser(body, idUser);
        res.json({
            message: 'UPDATE user success',
            data: {
                id: idUser,
                ...body
            },
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}

const deleteUser = async (req, res) => {
    const {idUser} = req.params;
    try {
        await UsersModel.deleteUser(idUser);
        res.json({
            message: 'DELETE user success',
            data: null
        })
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}

const ifUser = async (req, res) => {
    const {body} = req;
    const user=await UsersModel.ifUser(body);
    
    
    try {
        if(user[0].length>0){
            console.log(user[0]);
            res.redirect('http://localhost:4000/index');
        }
        else {
            return cb(null, null);
         }
       
        
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error,
        })
    }
}






module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    ifUser
}