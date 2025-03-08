const mysql = require('mysql2');
const dburl = process.env.dburl;
const dbpassword = process.env.dbpassword;

const pool = mysql.createPool({
  host: `${dburl}`,
  user: 'gaobin',
  password: `${dbpassword}`,
  database: 'ywh',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

var res = null;
// 执行查询
pool.query('SELECT * FROM user', (error, results, fields) => {
  if (error) throw error;
  console.log(results);
  res = results;
});

exports.handler = async () => {
  return {
    statusCode: 200,
    body: `hello world! I have a BUG : ${res}`
  };
};

