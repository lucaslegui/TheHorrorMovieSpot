//loading page...

window.onload = function() {
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none';
    }, 3000);
};



//instalar app
window.addEventListener('DOMContentLoaded', () => {
    //registrar el ayuwokin
    if('serviceWorker' in navigator){
        navigator.serviceWorker
        .register('Service_Worker.js')
        .then(respuesta => console.log('Sw registrado correctamente'))
        .catch(error => console.log('sw no se pudo registrar'))
    }
    
    let eventInstall;
    let btnInstall = document.querySelector(".btnInstall");

    let InstallApp = () => {
        if(eventInstall){
            eventInstall.prompt();
            eventInstall.userChoice
            .then(res => {
                if(res.outcome === "accepted"){
                    console.log("el user acepto instalar mi super app");
                    btnInstall.style.display = "none";
                }else{
                     alert("como que no?");
                }
            })
        }
    }
    
    window.addEventListener("beforeinstallprompt", (e) => {
        
        e.preventDefault();
        eventInstall = e;
        showInstallButton();
    })

    let showInstallButton = () => {
        if(btnInstall != undefined){
            btnInstall.style.display = "inline-block";
            btnInstall.addEventListener("click", InstallApp)
        }
    }
});


/////////////////////////////////API/////////////////////////////////////

const API_KEY = 'af52bc36eb86e5bf423dc0874dfdcfd9';
const GENRE_ID_HORROR = 27;
const GENRE_ID_SCIFI_FANTASY = 10765;
// URLs para películas y series
const MOVIE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${GENRE_ID_HORROR}&sort_by=popularity.desc&language=es-MX`;
const TV_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${GENRE_ID_SCIFI_FANTASY}&sort_by=popularity.desc&language=es-MX`;
// URL para proximos estrenos
const UPCOMING_MOVIE_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=es-MX`;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjUyYmMzNmViODZlNWJmNDIzZGMwODc0ZGZkY2ZkOSIsInN1YiI6IjY1MjYwNmEwZDM5OWU2MDBhZGRhNjY5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qC535LtHz7S9eADkl0MoVsTrcEhfJLY24VL9Xx-9VAI'
    }
};

//obtener datos
function fetchDataAndDisplay(url, displayFunction, type) {
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            const items = data.results;
            displayFunction(items, type);
            //    console.log(data);
        })

        .catch(error => {
            console.error(`Error al obtener ${type === 'movie' ? 'las películas' : 'las series'}:`, error);
        });

}


// listener para filtrar películas
document.getElementById('sortOrder').addEventListener('change', function () {
    const container = document.getElementById('recommended-movies');
    let items = JSON.parse(container.getAttribute('data-items'));
    const order = this.value;

    items.sort((a, b) => {
        if (order === 'desc') {
            return b.vote_average - a.vote_average;
        } else {
            return a.vote_average - b.vote_average;
        }
    });

    displayMovies(items, 'movie');
});

// Mostrar películas
function displayMovies(items, type) {
    const container = document.getElementById('recommended-movies');
    container.setAttribute('data-items', JSON.stringify(items));
    let htmlContent = '';

    items.forEach(item => {
        htmlContent += `
            <div class="movie-card card" data-id="${item.id}">
                <div class="card-inner">
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
                    <h4>${item.title || item.name}</h4>
                    <p>Calificación:<i class="fa-solid fa-star fa-beat" style="color: #f7ef02;"></i> ${item.vote_average}/10</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;

    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            const itemId = card.getAttribute('data-id');
            showModal(itemId, items, type);
        });
    });
}

// Obtener y mostrar películas
fetchDataAndDisplay(MOVIE_URL, displayMovies, 'movie');

// Mostrar series
function displaySeries(series) {
    const seriesContainer = document.getElementById('recommended-series');
    let seriesHTML = '';
    seriesContainer.setAttribute('data-items', JSON.stringify(series));

    series.forEach(serie => {
        seriesHTML += `
        <div class="series-card card" data-series-id="${serie.id}">
        <div class="card-inner">
          <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
          <h4>${serie.name}</h4>
          <p>Calificación:<i class="fa-solid fa-star fa-beat" style="color: #f7ef02;"></i> ${serie.vote_average}/10</p>
        </div>
        </div>
      `;
    });

    seriesContainer.innerHTML = seriesHTML;
    // Evento al hacer clic en la tarjeta para mostrar detalles de la serie
    const seriesCards = document.querySelectorAll('.series-card');
    seriesCards.forEach(card => {
        card.addEventListener('click', function () {
            const seriesId = card.getAttribute('data-series-id');
            showSeriesReview(seriesId, series);
        });
    });
}

function showSeriesReview(seriesId, series) {
    const serie = series.find(s => s.id == seriesId);
    
    if (!serie) {
        console.error(`Series with ID ${seriesId} not found.`);
        return;
    }

    showModal(seriesId, series, 'series');
}

document.getElementById('seriesSortOrder').addEventListener('change', function () {
    const seriesContainer = document.getElementById('recommended-series');
    let seriesItems = JSON.parse(seriesContainer.getAttribute('data-items'));
    const order = this.value;

    seriesItems.sort((a, b) => {
        if (order === 'desc') {
            return b.vote_average - a.vote_average;
        } else {
            return a.vote_average - b.vote_average;
        }
    });

    displaySeries(seriesItems);
});


// Mostrar próximos estrenos
function displayUpcomingMovies(movies) {
    const upcomingMoviesContainer = document.getElementById('upcoming-movies');
    let upcomingMoviesHTML = '';

    movies.forEach(movie => {
        upcomingMoviesHTML += `
            <div class="upcoming-movie-card card" data-id="${movie.id}">
                <div class="card-inner">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <h4>${movie.title}</h4>
                    <p>Fecha de estreno: ${movie.release_date}</p>
                </div>
            </div>
        `;
    });

    upcomingMoviesContainer.innerHTML = upcomingMoviesHTML;
}



// Obtener y mostrar series
fetchDataAndDisplay(TV_URL, displaySeries, 'tv');

//mostrar modal
function showModal(itemId, items, type) {
    const item = items.find(i => i.id == itemId);
    if (!item) {
        console.error(`Item with ID ${itemId} not found.`);
        return;
    }

    const modalTitle = document.getElementById(`${type}ModalLabel`);
    const modalReview = document.getElementById(`${type}Review`);

    modalTitle.textContent = item.title || item.name || 'Unknown Title';
    modalReview.textContent = item.overview || `No hay review disponible para este ${type === 'movie' ? 'película' : 'serie'}.`;
    //constructor boton favoritos
    const favoritosBtn = document.createElement('button');
    favoritosBtn.textContent = 'Agregar a Favoritos';
    favoritosBtn.classList.add('btn', 'btn-danger');
    favoritosBtn.addEventListener('click', () => AgregarAFavoritos(item));

    const saltoDeLinea = document.createElement('br');
    modalReview.appendChild(saltoDeLinea);

    modalReview.appendChild(favoritosBtn);

    const modal = new bootstrap.Modal(document.getElementById(`${type}Modal`));
    modal.show();
}


// interacciones

// agregar a favoritos
function AgregarAFavoritos(item) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (favoritos.some(fav => fav.id === item.id)) {
        alert('Ya has agregado este ítem a favoritos!');
        return;
    }
    favoritos.push(item);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    alert('¡Ítem agregado a favoritos!');
}

// mostrar favoritos
document.getElementById('showFavoritos').addEventListener('click', function () {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    let htmlContent = '';

    if (favoritos.length === 0) {
        htmlContent = '<p>No tienes ítems en tus favoritos.</p>';
    } else {
        favoritos.forEach(item => {
            htmlContent += `
                <div class="favorite-item">
                    <h4>${item.title || item.name}</h4>
                    <p>${item.overview}</p>
                </div>
            `;
        });
    }

    const modalBody = document.getElementById('favoritosModalBody');
    modalBody.innerHTML = htmlContent;

    const modal = new bootstrap.Modal(document.getElementById('favoritosModal'));
    modal.show();
});