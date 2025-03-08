const mysql = require('mysql');

exports.handler = async () => {
  const mySecret = process.env.dburl;
  return {
    statusCode: 200,
    body: `hello world! I have a ${mySecret}`
  };
};

