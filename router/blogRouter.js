const express = require('express');
const router = express.Router();
const query = require('../db/dbUtils').query;
const genId = require('../db/dbUtils').genId;

/**
 * 添加博客
 * 
 * @param {String} title 标题
 * @param {String} content 内容
 * @param {Number} categoryId 分类
 * @param {String} status 状态 0 草稿 1 发布
 */
router.post('/add', async (req, res) => {
    let { title, content, categoryId, status } = req.body;
    let id = genId.NextId();
    let createTime = new Date().getTime();
    let out = await query('insert into blog (id, title, content, category_id, status, create_time) values (?, ?, ?, ?, ?, ?)', [id, title, content, categoryId, status, createTime]);
    res.send({
        code: 200,
        msg: '添加成功',
    })
})

/**
 * 修改博客
 * 
 * @param {String} id 博客id
 * @param {String} title 标题
 * @param {String} content 内容
 * @param {Number} categoryId 分类
 * @param {Number} status 状态 0草稿  1正常  2删除 
 */
router.post('/update', async (req, res) => {
    let { id, title, content, categoryId, status } = req.body;
    let out = await query('update blog set title = ?, content = ?, category_id = ?, status = ? where id = ?', [title, content, categoryId, status, id]);
    res.send({
        code: 200,
        msg: '修改成功',
    })
})

/**
 * 删除博客
 * 
 * @param {String} id 博客id
 * @param {Number} status 状态 0草稿  1正常  2删除
 */
router.post('/delete', async (req, res) => {
    let { id, status } = req.body;
    let out = await query('update blog set status = ? where id = ?', [status, id]);
    res.send({
        code: 200,
        msg: '操作成功',
    })
})

/**
 * 获取博客列表
 * 
 * @param {Number} page 页码
 * @param {Number} pageSize 每页条数
 * @param {Number} categoryId 分类id
 * @param {Number} status 状态 0草稿  1正常  2删除
 */
router.post('/list', async (req, res) => {
    let { page, pageSize, categoryId, status } = req.body;
    // 返回总条数, 页码, 每页条数, 数据
    let out = await query('select count(*) as total from blog where category_id = ? and status = ?', [categoryId, status]);
    let total = out[0].total;
    let totalPage = Math.ceil(total / pageSize);
    let offset = (page - 1) * pageSize;
    // 获取博客id 分类id 标题 创建时间 截取内容50个字符
    let list = await query('select id, category_id, title, create_time, substring(content, 1, 50) as content from blog where category_id = ? and status = ? order by create_time desc limit ?, ?', [categoryId, status, offset, pageSize]);
    // let data = await query('select * from blog where category_id = ? and status = ? limit ?, ?', [categoryId, status, offset, pageSize]);
    res.send({
        code: 200,
        msg: '获取成功',
        data: {
            total: total,
            totalPage: totalPage,
            page: page,
            pageSize: pageSize,
            data: data
        }
    })
})

/**
 * 查询博客
 * 
 * @param {String} keyword 关键字
 * @param {String} categoryId 分类ID
 * @param {Number} page 页码
 * @param {Number} pageSize 每页条数
 */
router.post('/search', async (req, res) => {
    let { keyword, categoryId, page, pageSize } = req.body;
    let status = 1;
    let out = await query('select count(*) as total from blog where category_id = ? and status = ? and title like ?', [categoryId, status, '%' + keyword + '%']);
    let total = out[0].total;
    let totalPage = Math.ceil(total / pageSize);
    let offset = (page - 1) * pageSize;
    // 获取博客id 分类id 标题 创建时间 截取内容50个字符
    let data = await query('select id, category_id, title, create_time, substring(content, 0, 50) as content from blog where category_id = ? and status = ? and title like ? limit ?, ?', [categoryId, status, '%' + keyword + '%', offset, pageSize]);
    // let data = await query('select * from blog where category_id = ? and status = ? and title like ? limit ?, ?', [categoryId, status, '%' + keyword + '%', offset, pageSize]);
    res.send({
        code: 200,
        msg: '获取成功',
        data: {
            total: total,
            totalPage: totalPage,
            page: page,
            pageSize: pageSize,
            data: data
        }
    })
})

/**
 * 获取博客详情
 * 
 * @param {String} id 博客id
 * @param {Number} status 状态 0草稿  1正常  2删除
 */

router.post('/detail', async (req, res) => {
    let { id, status } = req.body;
    let out = await query('select * from blog where id = ? and status = ?', [id, status]);
    res.send({
        code: 200,
        msg: '获取成功',
        data: out[0]
    })
})

module.exports = router;