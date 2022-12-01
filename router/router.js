const express = require('express');
const router = express.Router();
const query = require('../db/dbUtils').query;
const genId = require('../db/dbUtils').genId;

router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;