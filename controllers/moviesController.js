const { validationResult } = require('express-validator');
const { Sequelize } = require('../database/models')
const moment = require('moment')
const fs = require('fs')
let db = require('../database/models')

let Op = Sequelize.Op; //operadores

module.exports = {
    list: function (req, res) {
        db.Peliculas.findAll({
            include: [
                {association: 'genero'},
                {association: 'actores'},
                {association : 'imagenes'}
            ]
        }
        )
            .then(peliculas => {
                res.send(peliculas)
            })
    },
    all: function (req, res) {
        db.Peliculas.findAll({
            include : [
                {association : 'imagenes'}
            ]
        })
            .then(peliculas => {
                res.render('movies', {
                    peliculas: peliculas
                })
            })
            .catch(error => {
                res.send(error)
            })
    },
    detail: function (req, res) {
        db.Peliculas.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    association: 'genero'
                },
                {
                    association: 'actores'
                },
                {
                    association : 'imagenes'
                }
            ]
        })
            .then(pelicula => {
                res.render('moviesDetail', {
                    pelicula
                })
            })
    },
    new: function (req, res) {
        db.Peliculas.findAll({
            order: [
                ['release_date', 'DESC'] //ordenados por fecha
            ],
            limit: 5
        })
            .then(peliculas => {
                res.render('moviesNew', {
                    peliculas: peliculas
                })
            })
    },
    recommended: function (req, res) {
        db.Peliculas.findAll({
            where: {
                awards: {
                    [Op.gte]: 8 //premio mayor o igual a 8
                }
            }
        })
            .then(peliculas => {
                res.render('moviesRecommended', {
                    peliculas: peliculas
                })
            })
    },
    search: function (req, res) {
        let search = req.body.search

        db.Peliculas.findAll({
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            include : [
                {association: 'imagenes'}
            ]
        })
            .then(peliculas => {
                res.render('movies', {
                    peliculas: peliculas
                })
            })
    },
    create: function (req, res) {
        let generos = db.Generos.findAll({
            order: [
                ['name', 'ASC']
            ]
        });
        let actores = db.Actores.findAll({
            order: [
                ['first_name', 'ASC']
            ]
        });
        Promise.all([generos, actores])
            .then(([generos, actores]) => {
                res.render('moviesAdd', {
                    generos: generos,
                    actores: actores
                })
            })

    },
    save: function (req, res) {
        let errors = validationResult(req);
        const {title,rating,awards,release_date,length,genre_id,imageStorage} = req.body

        if (errors.isEmpty()) {
            db.Peliculas.create({
                title,
                rating,
                awards,
                release_date,
                length,
                genre_id : +genre_id
            })
                .then(newPeli => {
                    if (typeof req.body.actores == "string") {
                        db.actor_movie.create({
                            movie_id: newPeli.id,
                            actor_id: req.body.actores
                        })
                    } else {
                        req.body.actores.forEach(id => {
                            db.actor_movie.create({
                                movie_id: newPeli.id,
                                actor_id: id
                            })
                        });
                    }
                    db.Image.create({
                        archivo : req.files[0].filename || imageStorage,
                        movieId : newPeli.id
                    })

                    return res.redirect('/movies?create=ok')
                })
        } else {
            errors = errors.mapped();
            if (req.fileValidationError) {
                errors = {
                    ...errors,
                    image: {
                        msg: req.fileValidationError
                    }
                }
            }
            let generos = db.Generos.findAll({
                order: [
                    ['name', 'ASC']
                ]
            });
            let actores = db.Actores.findAll({
                order: [
                    ['first_name', 'ASC']
                ]
            });
            Promise.all([generos, actores])
                .then(([generos, actores]) => {
                    res.render('moviesAdd', {
                        generos,
                        actores,
                        errors,
                        old: req.body,
                        image : req.files[0] ? req.files[0].filename  : null,
                    })
                })
        }
    },
    edit: function (req, res) {
        let pelicula = db.Peliculas.findOne({
            where: {
                id: req.params.id
            },
            include: [
                { association: 'genero' },
                { association: 'actores'},
                { association : 'imagenes'}
            ]
        });
        let generos = db.Generos.findAll();
        let actores = db.Actores.findAll({
            order: [
                ['first_name', 'ASC']
            ]
        });
        Promise.all([pelicula, generos, actores])
            .then(([pelicula, generos, actores]) => {
                //edito el formato de la fecha para que se muestra de manera correcta en el value de 'fecha de estreno'
                Object.defineProperty(pelicula,'release_date', {
                    value : moment(pelicula.release_date).format('YYYY-MM-DD')
                })
                res.render('moviesEdit', {
                     actores,
                     generos,
                     pelicula,
                    })
            })
    },
    update: function (req, res) {
        let errors = validationResult(req)
        const {title,rating,awards,release_date,length,genre_id,imageStorage} = req.body
        if (errors.isEmpty()) {
            db.Peliculas.update(
                {
                    title,
                    rating,
                    awards,
                    release_date,
                    length,
                    genre_id : genre_id ? +genre_id : null
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
                .then(() => {
                    if(req.files[0]){
                        db.Image.findOne({
                            where : {
                                movieId : req.params.id
                            }
                        })
                        .then(imagen => {
                            if(imagen){
                                fs.existsSync('./public/images/' + imagen.archivo) ? fs.unlinkSync('./public/images/' + imagen.archivo) : null
                                db.Image.update(
                                    {
                                        archivo : req.files[0].filename
                                    },
                                    {
                                        where : {
                                            movieId : req.params.id
                                        }
                                    }
                                )
                            }else{
                                db.Image.create({
                                    archivo : req.files[0].filename,
                                    movieId : req.params.id
                                })
                            }
                         
                        })
                    }
                    return res.redirect('/movies/detail/' + req.params.id + '?update=ok')
                })
                .catch(error => {
                    res.send(error)
                })
        } else {
            errors = errors.mapped();
            if (req.fileValidationError) {
                errors = {
                    ...errors,
                    image: {
                        msg: req.fileValidationError
                    }
                }
            }
            let pelicula = db.Peliculas.findOne({
                where: {
                    id: req.params.id
                },
                include: [
                    { association: 'genero' },
                    { association: 'actores' },
                    { association : 'imagenes'}

                ]
            });
            let generos = db.Generos.findAll();
            let actores = db.Actores.findAll({
                order: [
                    ['first_name', 'ASC']
                ]
            });
            Promise.all([pelicula, generos, actores])
            .then(([pelicula, generos, actores]) => {
                Object.defineProperty(pelicula,'release_date', {
                    value : moment(pelicula.release_date).format('YYYY-MM-DD')
                })
                let image = req.files[0] ? req.files[0].filename  : null

                    res.render('moviesEdit', {
                        generos,
                        actores,
                        errors,
                        pelicula,
                        old: req.body,
                        image,

                    })
                })
        }
    },
    addImage : (req,res) => {
        db.Image.create({
            archivo : req.files[0].filename,
            movieId : req.params.id
        })
        .then(() => res.redirect('/movies/detail/' + req.params.id))
        .catch(error => console.log(error))
    },
    delete: function (req, res) {
        db.actor_movie.destroy({
            where: {
                movie_id: req.params.id
            }
        })
            .then(result => console.log('se ha eliminado la relación correctamente'))
            .catch(error => res.send(error))

        db.Peliculas.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(result => {
                console.log('Pelicula Eliminada');
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    }
}