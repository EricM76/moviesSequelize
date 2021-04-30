let db = require('../database/models')

module.exports = {

    list: function(req,res){
        db.Actores.findAll()
        .then( actores => {
            res.send(actores)
        })
    },
    view:function(req,res){
        db.Actores.findOne({
            where : {
                id : req.params.id
            },
            include : [
                {
                    association : 'peliculas'
                },
                {
                    association : 'favorita'
                }
            ]
        })
        .then(actor => {
            res.render('actorsView',{
                actor : actor,
                favorita : actor.favorita,
                peliculas : actor.peliculas
            })
        })
    }





}