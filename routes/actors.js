const express = require('express');
const router = express.Router();

const actorsController = require('../controllers/actorsController');

router.get('/',actorsController.list);
router.get('/view/:id',actorsController.view);


module.exports = router;