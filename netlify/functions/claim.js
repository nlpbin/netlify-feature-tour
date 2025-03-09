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
    if (event.httpMethod!== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { open_id, cellphone, name, owner, owner_cellphone, role, rooms } = JSON.parse(event.body);
        const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';

        let finalOwner = owner;
        let finalOwnerCellphone = owner_cellphone;

        if (role === 'owner') {
            finalOwner = name;
            finalOwnerCellphone = cellphone;
        }

        // 创建新的数据库连接
        const connection = await mysql.createConnection(config);

        try {
            for (const room of rooms) {
                const query = 'INSERT INTO claim (room, open_id, name, cellphone, owner, owner_cellphone, role, client_ip) VALUES (?,?,?,?,?,?,?,?)';
                await connection.execute(query, [room, open_id, name, cellphone, finalOwner, finalOwnerCellphone, role, clientIp]);
            }
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Data inserted successfully' })
            };
        } finally {
            // 关闭数据库连接
            await connection.end();
        }
    } catch (error) {
        console.error('Error in Netlify function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
