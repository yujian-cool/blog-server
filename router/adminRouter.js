const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const query = require('../db/dbUtils').query;
const genId = require('../db/dbUtils').genId;

router.post('/login', async (req, res) => {
    let { account, password } = req.body;
    let out = await query('select * from admin where account = ? and password = ?', [account, password]);
    if (out.length > 0) {
        let token = uuidv4();
        let id = out[0].id;
        let update = await query('update admin set token = ? where id = ?', [token, id]);
        res.send({
            code: 200,
            msg: '登录成功',
            data: {
                token: token
            }
        })
    } else {
        res.send({
            code: 400,
            msg: '登陆失败！'
        })
    }
})

module.exports = router;