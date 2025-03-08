const mysql = require('mysql2');
const dburl = process.env.dburl;
const dbpassword = process.env.dbpassword;

const conn = mysql.createConnection({
    host: `${dburl}`,
    user: 'gaobin',
    password: `${dbpassword}`,
    database: 'ywh'
});

// 定义一个处理数据库查询的 Promise 函数
function queryDatabase() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM user', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

exports.handler = async() => {
    const ans = await queryDatabase();
    return {
            statusCode: 200,
            body: 'hello'
    }
    return {
            statusCode: 200,
            body: ans
    }
}
