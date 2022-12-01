const express = require('express');
const router = express.Router();
const query = require('../db/dbUtils').query;
const genId = require('../db/dbUtils').genId;

// 分类接口

// 获取分类列表
// 增加分类
// 修改分类
// 删除分类

/**
 * 获取分类列表
 */
router.get('/list', async (req, res) => {
    let out = await query('select * from category');
    res.send({
        code: 200,
        msg: '获取分类列表成功',
        data: out
    })
})

/**
 * 增加分类
 *  
 * @param {String} name 分类名称
 */
router.post('/add', async (req, res) => {
    let { name } = req.body;
    let id = genId.NextId();
    let out = await query('insert into category (id, name) values (?, ?)', [id, name]);
    res.send({
        code: 200,
        msg: '增加分类成功',
    })
})

/**
 * 修改分类
 * 
 * @param {String} id 分类id
 * @param {String} name 分类名称
 */
router.post('/update', async (req, res) => {
    let { id, name } = req.body;
    let out = await query('update category set name = ? where id = ?', [name, id]);
    res.send({
        code: 200,
        msg: '修改分类成功',
    })
})

/**
 * 删除分类
 * 
 * @param {String} id 分类id
 * @param {String} name 分类名称
 */

router.post('/delete', async (req, res) => {
    let { id } = req.body;
    let out = await query('delete from category where id = ?', [id]);
    res.send({
        code: 200,
        msg: '删除分类成功',
    })
})

module.exports = router;