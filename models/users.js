 const dbPool = require('../config/db.js');
// belum nambahin update password

const getAlluserid = () => {
    const SQLQuery = 'SELECT * FROM userid';
    return dbPool.execute(SQLQuery);
}

const createNewUser = (body) => {
    const SQLQuery = ` INSERT INTO userid (nama, email, pwd)
                       VALUES( '${body.nama}', '${body.email}', '${body.password}')`;
    return dbPool.execute(SQLQuery);
}

const updateUser = (body, idUser) => {
    const SQLQuery = `  UPDATE userid 
                        SET name='${body.name}', email='${body.email}', address='${body.role}' 
                        WHERE id=${idUser}`;
    return dbPool.execute(SQLQuery);
}

const deleteUser = (idUser) => {
    const SQLQuery = `DELETE FROM userid WHERE id=${idUser}`;
    return dbPool.execute(SQLQuery);
}

const ifUser = (body,cb)=>{
    // const SQLQuery = `SELECT * FROM userid WHERE email='${body.email}' AND pwd='${body.password}`;
    const SQLQuery = `SELECT * FROM userid WHERE email='admin@bps.id' AND pwd='123'`;
    dbPool.query(SQLQuery,function(err,rows,fields){
        if(err) throw err;
        if (rows.length > 0) {
            cb(null, rows[0]);
        } else {
           return cb(null, null);
        }
    });;
}

module.exports = {
    getAlluserid,
    createNewUser,
    updateUser,
    deleteUser,
    ifUser
}