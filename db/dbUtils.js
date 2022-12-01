const genId = require('./connect').genId;
const connection = require('./connect').connection;



// 封装Promise
function query(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params ? params : [], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}

// 验证token
async function verifyToken(token) {
    let out = await query('select * from admin where token = ?', [token]);
    if (out.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    query: query,
    genId: genId,
    verify: verifyToken
}