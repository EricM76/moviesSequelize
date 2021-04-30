const db = require('../database/models')


module.exports = {
    getMovies : (req,res) => {
        db.Peliculas.findAll({
            include : [
                {association : 'imagenes'}
            ]
        })
        .then(peliculas => res.status(200).json(peliculas))
        .catch(error => console.log(error))
    }
}