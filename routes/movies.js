const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();

const moviesController = require('../controllers/moviesController');
let moviesValidator = require('../validations/moviesValidator');
let upLoadImages = require('../middlewares/upImages')

router.get('/',moviesController.all);
router.get('/list',moviesController.list);
router.get('/detail/:id',moviesController.detail);
router.get('/new',moviesController.new);
router.get('/recommended',moviesController.recommended);
router.post('/search',moviesController.search);

router.get('/create',moviesController.create);
router.post('/create',upLoadImages.any(),moviesValidator, moviesController.save);

router.get('/edit/:id',moviesController.edit);
router.put('/edit/:id',upLoadImages.any(),moviesValidator,moviesController.update);
router.post('/add/image/:id',upLoadImages.any(),moviesController.addImage)

router.delete('/delete/:id',moviesController.delete);

module.exports = router;