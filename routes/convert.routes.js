const express = require('express');
const { convert } = require('../controllers/convert.controllers');

const router = express.Router();

router.post('/', convert);

module.exports = router;