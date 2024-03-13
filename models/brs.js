const dbPool = require('../config/db.js');

const getAllData = () => {
    const SQLQuery = `SELECT * from brs`;
    return dbPool.execute(SQLQuery);
}
const updateData = (body) => {
    const SQLQuery = `UPDATE brs SET Link='${body.link}' WHERE id='${body.id}'`;
    return dbPool.execute(SQLQuery);
}
const insertData=(body)=>{
    const SQLQuery = `INSERT INTO brs VALUES(${body.tahun},${body.bulan},${body.link})`;
    return dbPool.execute(SQLQuery);
}

module.exports = {
    getAllData,
    updateData,
    insertData

}