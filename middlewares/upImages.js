const path = require('path'); //requiero el paquete de path
const multer = require('multer'); //requiero el paquete de multer para manejar archivos


let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

const fileFilter = function(req, file,callback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
        req.fileValidationError = "Solo imágenes";
        return callback(null,false,req.fileValidationError);
    }
    callback(null,true);

}

const upload =  multer({
    storage,
    fileFilter
})


module.exports = upload

