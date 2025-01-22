const express = require('express');
const router = express.Router();
const timeController = require('../controllers/timeController');

router.get('/', timeController.getAllTimes);

module.exports = router;