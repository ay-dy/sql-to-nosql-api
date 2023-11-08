const express = require('express');
const { establishConnection, closeConnection } = require('../controllers/mysql.controllers');

const router = express.Router();

router.post('/connect', establishConnection);
router.post('/disconnect', closeConnection);

module.exports = router;