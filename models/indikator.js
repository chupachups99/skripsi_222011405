const dbPool = require('../config/db.js');

const getAllData = () => {
    // const SQLQuery = `SELECT tahun,bulan,kode_prov_baru,jenis_akomodasi, kelas_akomodasi,SUM(MTA) AS MTA_,SUM(TA) AS TA_ ,SUM(MTNUS) AS MTNUS_, SUM(TNUS) AS TNUS_,SUM(MKTJ)/SUM(MKTS)*100 AS TPK_,
    // SUM(MTA)/SUM(TA) AS RLMTA_, SUM(MTNUS)/SUM(TNUS) AS RLMTNUS_, SUM(MTNUS)+SUM(MTA) AS MTGAB_, SUM(TA)+SUM(TNUS) AS TGAB_,  
    // (SUM(MTNUS)+SUM(MTA))/(SUM(TA)+SUM(TNUS)) AS RLMTGAB_ 
    // FROM tablename 
    // WHERE MKTS >=0 AND MKTJ >=0 AND MTA >=0 AND TA >=0 AND MTNUS>=0 AND TNUS >=0 
    // GROUP BY kode_prov_baru,tahun,bulan,jenis_akomodasi,kelas_akomodasi
    // ORDER BY kode_prov_baru,tahun,bulan,jenis_akomodasi,kelas_akomodasi;`;
    // return dbPool.execute(SQLQuery);
}

module.exports = {
    getAllData
}