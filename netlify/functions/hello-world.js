// const mysql = require('mysql2');
import mysql from 'mysql2/promise';
const dburl = process.env.dburl;
const dbpassword = process.env.dbpassword;

const conn = mysql.createConnection({
    host: `${dburl}`,
    user: 'gaobin',
    password: `${dbpassword}`,
    database: 'ywh'
});

// 定义一个处理数据库查询的 Promise 函数
async function queryDatabase() {
    try {
        // 创建数据库连接
        const connection = await mysql.createConnection(config);
        // 执行查询语句
        const [rows] = await connection.execute('SELECT * FROM user');
        // 关闭数据库连接
        await connection.end();
        return rows;
    } catch (error) {
        throw error;
    }
}

// 定义 Netlify 云函数处理函数
export async function handler(event, context) {
    try {
        // 调用查询数据库的函数
        const ans = await queryDatabase();
        // 返回 HTTP 响应
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ans)
        };
    } catch (error) {
        // 处理错误并返回错误响应
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
	    body: JSON.stringify({ error: '数据库查询出错', err: error })
        };
    }
}
