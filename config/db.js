const mysql = require('mysql2/promise');
const dbPool=mysql.createPool({
  host:'0.tcp.ap.ngrok.io',
  port:'17540',
  user:'root',
  password:'',
  database:'skripsi_dashboard'
});

const connectToMySQL = async () => {
  try {
      await dbPool.getConnection();
      console.log('MySQL database connected!');
  } catch (err) {
      console.log('MySQL database connection error!');

      process.exit(1);
  }
};

connectToMySQL().then();

module.exports = dbPool;   