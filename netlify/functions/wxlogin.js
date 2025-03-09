const axios = require('axios');

// 微信小程序的 appId 和 appSecret，需要替换为你的真实信息
const appId = process.env.appid;
const appSecret = process.env.appsecret;

exports.handler = async function (event, context) {
  if (event.httpMethod!== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { code } = JSON.parse(event.body);
    const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`);

    const { openid } = response.data;
    if (openid) {
      return {
        statusCode: 200,
        body: JSON.stringify({ open_id: openid })
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to get open_id', details: response.data })
      };
    }
  } catch (error) {
    console.error('Error in wechat login function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
