query = new URLSearchParams(location.search)

if(query.has('create') || query.has('update')){
    sessionStorage.clear()
}

if(document.getElementById('addImage')){
    document.getElementById('addImage').addEventListener('change',()=>{
        document.getElementById('addImageForm').submit()
    })
}
