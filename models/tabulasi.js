const dbPool = require('../config/db.js');

const getTahun =()=>{
    const SQLQuery = `SELECT DISTINCT tahun FROM tablename ORDER BY tahun`;
    return dbPool.execute(SQLQuery);
}
const getGroup = (body)=>{
    console.log(body);
    const SQLQuery = `SELECT DISTINCT `+body.columns+` FROM tablename ORDER BY `+body.columns;
    return dbPool.execute(SQLQuery);

}

const getAllData = (body) => {
    let SQL = `SELECT tahun,`+body.level;
    if(body.group){
        let str_sum = [];
        for(let i=0;i<body.listgroup.length;i++){
            let str_group = [];
            let name='';
            for(let j=0;j<Object.keys(body.listgroup[i]).length;j++){
                str_group.push(Object.keys(body.listgroup[i])[j]+" = "+body.listgroup[i][Object.keys(body.listgroup[i])[j]]);
                name=name+body.listgroup[i][Object.keys(body.listgroup[i])[j]].toString();
            }

             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MKTS ELSE 0 END) AS mkts_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MKTJ ELSE 0 END) AS mktj_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MKTJ ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MKTS ELSE 0 END) AS tpk_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MTNUS ELSE 0 END) AS mtnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN TNUS ELSE 0 END) AS tnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MTNUS ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN TNUS ELSE 0 END) AS rlmtnus_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MTA ELSE 0 END) AS mta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN TA ELSE 0 END) AS ta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MTA ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN TA ELSE 0 END) AS rlmta_`+name);
             str_sum.push(`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN MTA+MTNUS ELSE 0 END)/`+`SUM(CASE WHEN `+str_group.join(' AND ')+` THEN TA+TNUS ELSE 0 END) AS rlmtgab_`+name);


        }
        SQL = SQL +','+str_sum.join(',');
    }
    if(body.tahun){
        SQL = SQL + ` FROM tablename WHERE tahun in (`+body.tahun+`)  GROUP BY tahun,`+body.level ;
    }


    console.log(SQL);
    return dbPool.execute(SQL);
}

module.exports = {
    getAllData,
    getTahun,
    getGroup
}