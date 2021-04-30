const baseURL = window.location.origin;
const moviesBox = document.getElementById('moviesBox');
const orderSelect = document.getElementById('order');
const limitSelect = document.getElementById('limit')
const formMovies = document.getElementById('formMovies');
const title = document.getElementById('title');
const paginationBox = document.getElementById('paginationBox')


let query = new URLSearchParams(location.search)

const viewMovies = (peliculas) => {
    moviesBox.innerHTML = ""
    for (let i = 0; i < peliculas.length; i++) {
        let item = `<div class="col-12 col-md-3 col-lg-2 mb-2">
        <div class="card p-1" style="height:220px;">
            <a href=/movies/detail/${peliculas[i].id}">
                <img src="/images/${peliculas[i].imagenes[0] != null ? peliculas[i].imagenes[0].archivo : 'notImage.png'}" class="img-fluid" alt="...">
            </a>
        </div>
      </div>`
        moviesBox.innerHTML += item
    }
}

const getMovies = async () => {

    let response = await fetch(baseURL + '/api/movies')
    let peliculas = await response.json()
    //guardo las peliculas en localStorage
    localStorage.setItem('peliculas', JSON.stringify(peliculas))

    peliculas = JSON.parse(localStorage.getItem('peliculas'))

    viewMovies(peliculas)
}

orderSelect.addEventListener('change', () => {
    switch (orderSelect.value) {
        case 'title':
            var peliculas = JSON.parse(localStorage.getItem('peliculas'))
            peliculas.sort((a, b) => (a.title > b.title) ? 1 : (a.title < b.title) ? -1 : 0)
            localStorage.setItem('peliculas', JSON.stringify(peliculas))
            pagination(peliculas, limitSelect.value = 6, 1)
            break;
        case 'release_date':
            var peliculas = JSON.parse(localStorage.getItem('peliculas'))
            peliculas.sort((a, b) => (a.release_date > b.release_date) ? 1 : (a.release_date < b.release_date) ? -1 : 0)
            localStorage.setItem('peliculas', JSON.stringify(peliculas))
            pagination(peliculas, limitSelect.value = 6, 1)
            break;
        case 'recent':
            var peliculas = JSON.parse(localStorage.getItem('peliculas'))
            peliculas.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : (a.createdAt > b.createdAt) ? -1 : 0)
            localStorage.setItem('peliculas', JSON.stringify(peliculas))
            pagination(peliculas, limitSelect.value = 6, 1)
            break;
        default:
            var peliculas = JSON.parse(localStorage.getItem('peliculas'))
            peliculas.sort((a, b) => (a.id > b.id) ? 1 : (a.id < b.id) ? -1 : 0)
            localStorage.setItem('peliculas', JSON.stringify(peliculas))
            pagination(peliculas, limitSelect.value = 6, 1)
            break;
    }
})

limitSelect.addEventListener('change', () => {

    pagination(JSON.parse(localStorage.getItem('peliculas')), limitSelect.value, 1)

})

const pagination = (array, limit, current) => {
    let total = array.length;
    let pages = Math.ceil(total / limit);
    sessionStorage.setItem('pages', pages)

    //dibujo el paginador
    paginationBox.innerHTML = ` <li class="page-item goFirst" hidden>
                                    <a class="page-link goFirst" href="">&laquo</a>
                                </li>`
    for (let i = 1; i <= pages; i++) {
        let page = ` <li class="page-item ${current == i ? 'active' : ''}" id="pag${i}">
                            <a class="page-link"  href="#">${i}</a>
                        </li>`

        paginationBox.innerHTML += page
    }
    paginationBox.innerHTML += ` <li class="page-item goLast">
                                    <a class="page-link">&raquo</a>
                                </li>`


    //recorto el array conforme a la cantidad fijada
    peliculas = array.slice(0, limit)
    viewMovies(peliculas)

}

const goPage = (array, current, limit) => {
    //indico cuantos registros tiene que saltarse en la visualización
    let offset = (limit * current) - limit;
    //genero el grupo de peliculas a visusalizarse
    peliculas = array.slice(offset, limit * current)

    viewMovies(peliculas)
}

paginationBox.addEventListener('click', (e) => {
    let goFirstPage = document.querySelector('.goFirst')
    let goLastPage = document.querySelector('.goLast')
    //identifico la página elejida
    let page = e.target.parentElement
    let items = document.querySelectorAll('.page-item')
    //verifico que no se haga click en los extremos cuando están dehabilitados
    //remuevo todas paginas activas
    items.forEach(item => item.classList.remove('active'))
    //solo coloco en activo la pagina que corresponde
    page.classList.toggle('active')
    page.innerText == 1 ? goFirstPage.setAttribute('hidden', true) : goFirstPage.removeAttribute('hidden')
    page.innerText == sessionStorage.getItem('pages') ? goLastPage.setAttribute('hidden', true) : goLastPage.removeAttribute('hidden')
    //ejecuto la función que muestra las peliculas
    goPage(JSON.parse(localStorage.getItem('peliculas')), page.innerText, limitSelect.value)

    if (page.classList.contains('goFirst')) {
        e.preventDefault()
        items.forEach(item => {
            item.innerText == 1 ? item.classList.add('active') : item.classList.remove('active')
        })
        goFirstPage.setAttribute('hidden', true)
        goPage(JSON.parse(localStorage.getItem('peliculas')), 1, limitSelect.value)
    }
    if (page.classList.contains('goLast')) {
        e.preventDefault()
        items.forEach(item => {
            item.innerText == sessionStorage.getItem('pages') ? item.classList.add('active') : item.classList.remove('active')
        })
        goLastPage.setAttribute('hidden', true)
        goPage(JSON.parse(localStorage.getItem('peliculas')), sessionStorage.getItem('pages'), limitSelect.value)
    }

})


getMovies()




