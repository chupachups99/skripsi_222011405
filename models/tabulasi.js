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
             str_sum.push(`ROUND(SUM(CASE WHEN `+str_group.join(' AND ')+` THEN room_in_w + room_yesterday_w -room_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN room_w ELSE 0 END),2) AS tpk_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END) AS mtnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w ELSE 0 END) AS tnus_`+name);
             str_sum.push(`ROUND(SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w+wni_yesterday_w-wni_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w ELSE 0 END),2) AS rlmtnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END) AS mta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w ELSE 0 END) AS ta_`+name);
             str_sum.push(`ROUND(SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w ELSE 0 END),2) AS rlmta_`+name);
             str_sum.push(`ROUND(SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wni_in_w+wni_yesterday_w-wni_out_w+wna_in_w+wna_yesterday_w-wna_out_w ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN wna_in_w+wni_in_w ELSE 0 END),2) AS rlmtgab_`+name);


        }
        SQL = SQL +','+str_sum.join(',');
    }
    if(body.tahun){
        SQL = SQL + ` FROM tablename LEFT JOIN kodeprov ON tablename.kode_prov_baru=kodeprov.idProv WHERE tahun in (`+body.tahun+`)  GROUP BY Provinsi,`+body.level ;
    }


    console.log(SQL);
    return dbPool.execute(SQL);
}
const mysql = require('mysql2/promise')
const insertData= async(body)=>{
    
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database:'skripsi_dashboard'
      })
    
        // Start transaction
        let info=[];
        await connection.beginTransaction();
        let SQL = 'INSERT INTO dashboard_data (`tahun`, `bulan`, `kode_prov_baru`, `kode_kab_baru`, `jenis_akomodasi`, `kelas_akomodasi`, `room`, `bed`, `room_yesterday`, `room_in`, `room_out`, `wna_yesterday`, `wni_yesterday`, `wna_in`, `wni_in`, `wna_out`, `wni_out`) VALUES ';
        let json =body.data
        for (let i = 0; i < json.length; i++) {
            
          // console.log(i)
          let key = Object.keys(json[i])[0].toString();
          let keyDelim = key.replaceAll(',',"`,`");
          let columns = "(`"+keyDelim+"`)";
          let SQL = 'INSERT INTO dashboard_data '+columns+' VALUES ';
          let a = Object.values(json[i])[0].toString();
          let b = a.replaceAll(',', "','")
          SQL += `('` + b + `')`;
          console.log(SQL);
          try{
            await connection.query(SQL);
          }
          catch(err){
            info.push('Transaction Failed at row '+(i+1)+" "+err.toString());
            // console.log('Transaction Failed at row '+(i+1), err.toString());
          }
          
        }
    
        // // Execute your queries
        // // Commit the transaction
        if(info.length==0){
          await connection.commit();
          info.push('Transaction Completed Successfully.');
          return info;
        }else{
          await connection.rollback();
          info.push('Transaction Failed. Rolled Back.');
          return info;
    
        }
      
}


module.exports = {
    getAllData,
    getTahun,
    getGroup,
    getGroupData,
    insertData
}