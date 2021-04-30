const oneMB = 1048576;
const inputImagen = document.getElementById('image')
const labelImagen = document.getElementById('labelImage')
const inputImagenStorage = document.getElementById('imageStorage')

if(inputImagenStorage.value){
labelImagen.innerHTML = "Cambiar imagen"
sessionStorage.setItem('imagen',inputImagenStorage.value)
}
if(sessionStorage.getItem('imagen')){
    inputImagenStorage.value = sessionStorage.getItem('imagen')
    labelImagen.innerHTML = "Cambiar imagen"
    vistaPrevia.src = '/images/' + sessionStorage.getItem('imagen')
}

inputImagen.addEventListener('change',e => {
    switch (true) {
       /*  case !regExExt.exec(inputImagen.value):
            errorImagen.innerHTML = "Solo imágenes con extensión jpg, jpeg, png, gif, webp"
            inputImagen.classList.add('is-invalid')
            vistaPrevia.src = ""
            break; */
        case inputImagen.files[0].size > oneMB * 2 :
            errorImagen.innerHTML = "El archivo debe pesar menos de 2Mb"
            inputImagen.classList.add('is-invalid')
            vistaPrevia.src = ""
        break
    
        default:
            inputImagen.classList.remove('is-invalid');
            inputImagen.classList.add('is-valid');
            errorImagen.innerHTML = "";
            labelImagen.innerHTML = "Cambiar imagen"
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = ()=>{
                vistaPrevia.src = reader.result

            }
        break;
    }

})