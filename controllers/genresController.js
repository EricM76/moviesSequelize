const db = require('../database/models')

module.exports = {
    view : function(req,res){
        db.Generos.findOne({
            where : {
                id : req.params.id
            },
            include : [
                { association : 'peliculas'}
            ]
        })
        .then(genero => {
            res.render('genresView',{
                genero : genero,
                peliculas : genero.peliculas
            })
        })
    }
}