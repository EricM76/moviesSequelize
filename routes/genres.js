const express = require('express');
const router = express.Router();

const genresController = require('../controllers/genresController');

router.get('/:id',genresController.view);

module.exports = router;