let themeChanger = document.getElementsByClassName('themeChanger')[0]
themeChanger.addEventListener('click', changeTheme)
let loader = document.querySelector('.loader')
function changeTheme() {
    let body = document.querySelector('body')
    body.classList.toggle('dark')
}




async function sendRequest(url, method, data) {
    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data)
        })
    
        response = await response.json()
        return response
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
        })
        response = await response.json()
        return response
    }
}

async function test() {
    return await sendRequest('http://www.omdbapi.com/', "GET", {
        apikey: 'e7001e4a',
        t: 'iron'
    })
}

let searchBtn = document.getElementById('searchBtn')
searchBtn.addEventListener('click', findMovie)

async function findMovie() {
    loader.style.display = 'block'
    let searchTitle = document.getElementsByName('search')[0].value
    let response = await sendRequest('http://www.omdbapi.com/', "GET", {
        // apikey: 'e7001e4a',
        apikey: '7fda3365',
        t: searchTitle
    })

    console.log(response)
    if (response.Response == 'False') {
        alert('Фильм не найден')
        loader.style.display = 'none'
    }
    else {
        document.getElementById('main').style.display = 'block'
        loader.style.display = 'none'
        showMovie(response)
        findSimilarMovies()
    }
}



function showMovie(movie) {
    let title = movie.Title
    let img = movie.Poster
    
    document.getElementById('movieTitle').innerHTML = title
    document.getElementsByClassName('movieImage')[0].style.backgroundImage = `url(${img})`
 
    let params =  ['Year', 'Released', 'Genre', 'Country', 'Language', 'Director', 'Writer', 'Actors', "Country", "Type", "Runtime", "Ratings", "Rated"]
    let movieInfo = document.querySelector('.movieInfo')
    movieInfo.innerHTML = ''
    for(let i = 0; i < params.length; i++) {
        let param = params[i]
        let value = movie[param]
        let desc = `
        <div class="desc">
                        <div class="title">
                            ${param}
                        </div>
                        <div class="value">
                            ${value}
                        </div>
                    </div>
                    
        `
        movieInfo.innerHTML = movieInfo.innerHTML + desc
    }
   
}  



// {
//     "Title": "MIB",
//     "Year": "2021",
//     "Rated": "N/A",
//     "Released": "30 Apr 2021",
//     "Runtime": "N/A",
//     "Genre": "Short, Crime",
//     "Director": "Chris R. Notarile",
//     "Writer": "Chris R. Notarile",
//     "Actors": "Heath Harper, Debra Lamb, Lexsy McKowen",
//     "Plot": "N/A",
//     "Language": "English",
//     "Country": "United States",
//     "Awards": "N/A",
//     "Poster": "https://m.media-amazon.com/images/M/MV5BNTFkM2NiZDItNzY0MS00OWUyLWE1YTYtNjA4YThmOTFiMWNiXkEyXkFqcGdeQXVyMTg1MTc3MQ@@._V1_SX300.jpg",
//     "Ratings": [],
//     "Metascore": "N/A",
//     "imdbRating": "N/A",
//     "imdbVotes": "71",
//     "imdbID": "tt14425962",
//     "Type": "movie",
//     "DVD": "N/A",
//     "BoxOffice": "N/A",
//     "Production": "N/A",
//     "Website": "N/A",
//     "Response": "True"
// }

async function findSimilarMovies() {
    let searchTitle = document.getElementsByName('search')[0].value
    let response = await sendRequest('http://www.omdbapi.com/', "GET", {
        // apikey: 'e7001e4a',
        apikey: '7fda3365',
        s: searchTitle
    })

    console.log(response)
    if (response.Response == 'False') {
     
    }
    else {
        showSimilarMovies(response.Search)
        document.getElementById('similarMoviesTitle').innerHTML = `Похожих фильмов ${response.totalResults}`
    }
}

function showSimilarMovies(movies) {
    let similarMovies = document.querySelector('.similarMovies')
    similarMovies.innerHTML = ''
    for(let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        if(movie.Poster != 'N/A') {
        let similarMovie = `
        <div class="similarMovie" style="background-image: url('${movie.Poster}');">
                <div class="saved" data-imdbID='${movie.imdbID}' data-poster = '${movie.Poster}' data-title = '${movie.Title}'>
                    
                </div>
                <div class="similarTitle">
                    ${movie.Title}
                </div>
            </div>
        `
        similarMovies.innerHTML = similarMovies.innerHTML + similarMovie
        let saved = document.querySelectorAll('.saved');
        saved.forEach((elem) => {
            elem.addEventListener('click', addSaved)
        })
    }
}
}
// function addSaved() {
//     let elem = event.target
//     let movieId = elem.getAttribute('data-imdbID');
//     let title = elem.getAttribute('data-title')
//     let poster = elem.getAttribute('data-poster');

//     let favorites = localStorage.getItem('favorites')
//     favorites = JSON.parse(favorites)

//     const movieIndex = favorites.findIndex(fav => fav.movieId == movieId);
//     console.log(movieIndex);
//     if(movieIndex >= 0) {
//         favorites.splice(movieIndex, 1)
//         localStorage.setItem('favorites', JSON.stringify(favorites))
//         elem.classList.remove('activeF')
//     }else{
//         let obj = {movieId, title, poster}
//         elem.classList.add('activeF')
//         addFavoritsLS(obj)
//     }
// }


// function addFavoritsLS(movie) {
//     let favorites = localStorage.getItem('favorites')
//     if(!favorites) {
//         favorites = []
//     }else{
//         favorites = JSON.parse(favorites)
//     }
//     favorites.push(movie)
//     localStorage.setItem('favorits', JSON.stringify(favorites))
// }


function addSaved(){
    let elem = event.target
    let movieId = elem.getAttribute("data-imdbID");
    let title = elem.getAttribute("data-title");
    let poster = elem.getAttribute("data-poster");

    let favorites = localStorage.getItem("favorites")
    favorites = JSON.parse(favorites)

    const movieIndex = favorites.findIndex(fav => fav.movieId == movieId);
   
    if(favorites == null) {
        favorites = '[]'
    }
    
    if (movieIndex >= 0) {
        favorites.splice(movieIndex, 1)
        localStorage.setItem("favorites", JSON.stringify(favorites))
        elem.classList.remove("activeF")
    } else {
        let object = {movieId, title, poster}
        addtoFavoriteLS(object)
        elem.classList.add("activeF")
    }
}
function addtoFavoriteLS(movie){
    let favorites = localStorage.getItem('favorites')
    if(!favorites) {
        favorites = []
    } else {
        favorites = JSON.parse(favorites)
    }
    favorites.push(movie)
    localStorage.setItem("favorites", JSON.stringify(favorites))
}

function showFavorites() {
    let favorites = localStorage.getItem('favorites')
    if(favorites == null) {
        favorites = '[]'
    }
    favorites = JSON.parse(favorites)

    let similarMoviesTitle = document.getElementById('similarMoviesTitle')
    similarMoviesTitle.innerHTML = `Избранные фильмы ${favorites.length}`
    let similarMovies = document.querySelector('.similarMovies')
    similarMovies.innerHTML = ''
    favorites.forEach((fav)=>{
        let movieID = fav.movieId
        let poster = fav.poster
        let title = fav.title
        
        similarMovies.innerHTML = similarMovies.innerHTML + `
        <div class="similarMovie" style="background-image: url('${poster}');">
                <div class="saved activeF" data-imdbid="${movieID}" data-poster="${poster}"></div>
                <div class="similarTitle">${title}</div>
        </div>
        `
    })
    let saved = document.querySelectorAll('.saved');
        saved.forEach((elem) => {
            elem.addEventListener('click', favoriteHandler)
        })
}

function favoriteHandler() {
    addSaved()
    showFavorites()
}