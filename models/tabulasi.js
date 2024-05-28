const dbPool = require('../config/db.js');

const getTahun =()=>{
    const SQLQuery = `SELECT DISTINCT tahun FROM tablename ORDER BY tahun`;
    return dbPool.execute(SQLQuery);
}
const getGroupData=(body)=>{
    var SQL='SELECT ';
    let col = body.columns.split(',');
    for(let i=0;i<col.length;i++){
        SQL=SQL+'COUNT(DISTINCT '+col[i]+") AS "+col[i];
    }
    SQL=SQL+`FROM tablename`
    return dbPool.execute(SQL);
}

const getGroup = (body)=>{
    // let result = {};
    let col = body.columns.split(',');
    var SQLQuery='';
    // for(let i=0;i<col.length;i++){
    //     SQLQuery=SQLQuery+`SELECT COUNT(DISTINCT `+col[i]+`) from tablename;`;    
    // }
    SQLQuery = SQLQuery+`SELECT `+body.columns;
    if(col.includes('jenis_akomodasi')){
        SQLQuery=SQLQuery+`,CASE WHEN jenis_akomodasi=1 THEN 'Hotel Bintang' ELSE 'Hotel Nonbintang' END AS nama_jenis_akomodasi`;
        SQLQuery= SQLQuery+`,COUNT(*) OVER (PARTITION BY jenis_akomodasi) AS span_jenis_akomodasi`;
    }
    if(col.includes('kelas_akomodasi')){
        SQLQuery=SQLQuery+` ,CASE WHEN jenis_akomodasi=1 THEN CONCAT('Bintang ',kelas_akomodasi) ELSE CONCAT('Kelas ',kelas_akomodasi) END AS nama_kelas_akomodasi`;
        SQLQuery= SQLQuery+`,COUNT(*) OVER (PARTITION BY jenis_akomodasi,kelas_akomodasi) AS span_kelas_akomodasi`

    }

    SQLQuery=SQLQuery+` FROM tablename GROUP BY `+body.columns;
    // console.log(SQLQuery);

    
    return dbPool.execute(SQLQuery); 

}

const getAllData = (body) => {
    let SQL = `SELECT `+body.level+` ,kodeprov.Nama AS Provinsi`;
    if(body.group){
        let str_sum = [];
        for(let i=0;i<body.listgroup.length;i++){
            let str_group = [];
            let name='';
            for(let j=0;j<Object.keys(body.listgroup[i]).length/3;j++){
                str_group.push(Object.keys(body.listgroup[i])[j]+" = "+body.listgroup[i][Object.keys(body.listgroup[i])[j]]);
                name=name+body.listgroup[i][Object.keys(body.listgroup[i])[j]].toString();
            }

             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN room_w ELSE 0 END) AS mkts_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END) AS mktj_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN room_w ELSE 0 END) AS tpk_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END) AS mtnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w ELSE 0 END) AS tnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w ELSE 0 END) AS rlmtnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END) AS mta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w ELSE 0 END) AS ta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w ELSE 0 END) AS rlmta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w+wni_in_w ELSE 0 END) AS rlmtgab_`+name);


        }
        SQL = SQL +','+str_sum.join(',');
    }
    if(body.tahun){
        SQL = SQL + ` FROM tablename LEFT JOIN kodeprov ON tablename.kode_prov_baru=kodeprov.idProv WHERE tahun in (`+body.tahun+`)  GROUP BY Provinsi,`+body.level ;
    }


    console.log(SQL);
    return dbPool.execute(SQL);
}

module.exports = {
    getAllData,
    getTahun,
    getGroup,
    getGroupData
}