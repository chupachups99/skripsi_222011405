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
    const SQLQuery = `INSERT INTO brs(id, Tahun, Bulan, Link) VALUES(${body.id},${body.tahun},'${body.bulan}','${body.link}')`;
    console.log(SQLQuery);
    return dbPool.execute(SQLQuery);
}

module.exports = {
    getAllData,
    updateData,
    insertData
}