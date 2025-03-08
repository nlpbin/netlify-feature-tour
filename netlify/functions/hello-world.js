const mysql = require('mysql2');
const dburl = process.env.dburl;
const dbpassword = process.env.dbpassword;

// const pool = mysql.createPool({
//   host: `${dburl}`,
//   user: 'gaobin',
//   password: `${dbpassword}`,
//   database: 'ywh',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });


exports.handler = async() => {

const connection = mysql.createConnection({
    host: `${dburl}`,
    user: 'gaobin',
    password: `${dbpassword}`,
    database: 'ywh'
});

connection.connect((err) => {
    var ans;
    if (err) {
        ans = '数据库连接失败:';
	return ans;
    }

    const query = 'SELECT * FROM user';
    connection.query(query, (error, results, fields) => {
        if (error) {
            ans = '查询出错:';
        } else {
            const jsonResult = JSON.stringify(results);
            console.log('转换为 JSON 字符串的结果:', jsonResult);
	    ans = jsonResult;
        }

        connection.end((endErr) => {
            if (endErr) {
                ans = '关闭数据库连接出错:';
            }
        });
    });
    return {
        statusCode: 200,
        body: `hello world! I have a BUG ${pool}: ${ans}`
    }
});

}


exports.handler0 = async () => {
  var res = {};
  // 执行查询
  pool.query('SELECT * FROM user', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
    res.b = JSON.stringify(results);
  });
  return {
    statusCode: 200,
    body: `hello world! I have a BUG ${pool}: ${res.b}`
  };
};

