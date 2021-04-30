const fs = require('fs')
let {check,body} = require('express-validator');
var moment = require('moment');

module.exports = [
    check('title')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar el título de la película'),

    check('rating')
    .isDecimal({
        min:0
    })
    .withMessage('Debes indicar el ranting logrado'),

    check('length')
    .isLength({
        min:1
    })
    .withMessage('Debes indicar la duración en minutos'),

    check('awards')
    .isInt({
        min:0
    })
    .withMessage('Debes ingresar los premios que recibió'),

    check('release_date')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar la fecha de estreno'),

    body('release_date')
    .custom(value => {
        let fechaActual = moment()
        if(moment(value) > fechaActual){
            return false
        }else{
            return true
        }
    })
    .withMessage('La fecha es inválida'),

    body('image')
    .custom((value,{req}) => {
        console.log(req.files[0])
        console.log('----> imageStorage ' + req.body.imageStorage)
        if((req.files[0] && req.body.imageStorage) && req.files[0].filename != req.body.imageStorage){
            fs.existsSync('./public/images/' + req.body.imageStorage) ? fs.unlinkSync('./public/images/' + req.body.imageStorage) : null
        }
        if(req.files[0] || req.body.imageStorage){
            return true
        }else{
            return false
        }
    })
    .withMessage('No ha subido ningun archivo!')
]


