const express = require('express');
const { establishConnection, closeConnection } = require('../controllers/mongodb.controllers');

const router = express.Router();

router.post('/connect', establishConnection);
router.post('/disconnect', closeConnection);

module.exports = router;