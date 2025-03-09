const mysql = require('mysql2/promise');
const dburl = process.env.dburl;
const dbpassword = process.env.dbpassword;

const config = {
    host: `${dburl}`,
    user: 'gaobin',
    password: `${dbpassword}`,
    database: 'ywh'
};

exports.handler = async function (event, context) {
    // 只允许 GET 请求
    if (event.httpMethod!== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // 从查询参数中获取 room 值
        const { room } = event.queryStringParameters;

        // 检查 room 参数是否存在
        if (!room) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing "room" parameter' })
            };
        }

        // 从连接池获取连接
        const connection = await mysql.createConnection(config);

        try {
            // 执行 SQL 查询语句
            const [rows] = await connection.execute(
                'SELECT room1, name1, cellphone1, room2 FROM tasks WHERE room =?',
                [room]
            );

            // 检查是否有查询结果
            if (rows.length === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: 'No record found for the given room' })
                };
            }

            // 返回查询结果
            return {
                statusCode: 200,
                body: JSON.stringify(rows[0])
            };
        } finally {
            // 释放连接回连接池
            connection.release();
        }
    } catch (error) {
        console.error('Error in Netlify function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
