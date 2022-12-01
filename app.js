const express = require('express');
const app = express();
const port = require('./config').port;

const verifyToken = require('./db/dbUtils').verify;

const connection = require('./db/connect').connection;

// 处理跨域请求
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    next();
})

app.use(express.json());

const token_path = [
    '/admin/login',
    '/category/add',
    '/category/update',
    '/category/delete',
    '/blog/add',
    '/blog/update',
    '/blog/delete'
];
app.all('*', async (req, res, next) => {
    let path = req.path;
    if (token_path.includes(path)) {
        let token = req.body.token;
        let result = await verifyToken(token);
        if (result) {
            next();
        } else {
            res.send({
                code: 400,
                msg: 'token验证失败'
            })
        }
    } else {
        next();
    }
})

app.use('/admin', require('./router/adminRouter'));
app.use('/category', require('./router/categoryRouter'));
app.use('/blog', require('./router/blogRouter'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});