const db = require('../config').db;
const mysql = require('mysql');
const GenId = require('../utils/SnowFlake');
const genId = new GenId({ WorkerId: 1 });


module.exports = {
    connection: mysql.createConnection(db),
    genId: genId
}