//loading page...

window.onload = function () {
    setTimeout(function () {
        document.getElementById('loader').style.display = 'none';
    }, 3000);
};

//instalar app

window.addEventListener('DOMContentLoaded', () => {
    //registrar el ayuwokin
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('Service_Worker.js')
            .then(respuesta => console.log('Sw registrado correctamente'))
            .catch(error => console.log('sw no se pudo registrar'))
    }

    let eventInstall;
    let btnInstall = document.querySelector(".btnInstall");

    let InstallApp = () => {
        if (eventInstall) {
            eventInstall.prompt();
            eventInstall.userChoice
                .then(res => {
                    if (res.outcome === "accepted") {
                        console.log("el user acepto instalar mi super app");
                        btnInstall.style.display = "none";
                    } else {
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
        if (btnInstall != undefined) {
            btnInstall.style.display = "inline-block";
            btnInstall.addEventListener("click", InstallApp)
        }
    }
});

Notification.requestPermission().then(permission => {
    if (permission === "granted") {
        console.log("notificaciones permitidas");
    } else {
        console.log("noti denegada");
    }
});

document.getElementById('permitirPush').addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notificación permitida");
            // Aquí puedes agregar lógica adicional si es necesario
        } else {
            console.log("Notificación denegada");
        }
    });
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
            let items = data.results;

            // Filtrar por género de terror si es un estreno
            if (type === 'upcoming') {
                items = items.filter(item => item.genre_ids.includes(GENRE_ID_HORROR));
            }

            displayFunction(items, type);
        })
        .catch(error => {
            console.error(`Error al obtener ${type === 'movie' ? 'las películas' : 'las series'}:`, error);
        });
}



// Obtener datos de peliculas
fetchDataAndDisplay(MOVIE_URL, displayMovies, 'movie');

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


// Obtener datos de estrenos
fetchDataAndDisplay(UPCOMING_MOVIE_URL, displayUpcomingMovies, 'upcoming');

// Mostrar estrenos
function displayUpcomingMovies(estreno) {
    const upcomingMoviesContainer = document.getElementById('upcoming-movies');
    let upcomingMoviesHTML = '';
    upcomingMoviesContainer.setAttribute('data-items', JSON.stringify(estreno));

    estreno.forEach(estreno => {
        upcomingMoviesHTML += `
            <div class="upcoming-movie-card card" data-id="${estreno.id}">
                <div class="card-inner">
                    <img src="https://image.tmdb.org/t/p/w500${estreno.poster_path}" alt="${estreno.title}">
                    <h4>${estreno.title}</h4>
                    <p>Fecha de estreno: ${estreno.release_date}</p>
                    <p>Calificación:<i class="fa-solid fa-star fa-beat" style="color: #f7ef02;"></i> ${estreno.vote_average}/10</p>
                </div>
            </div>
        `;
    });

    upcomingMoviesContainer.innerHTML = upcomingMoviesHTML;

    const upcomingMovieCards = upcomingMoviesContainer.querySelectorAll('.upcoming-movie-card');
    upcomingMovieCards.forEach(card => {
        card.addEventListener('click', function () {
            const itemId = card.getAttribute('data-id');
            showModal(itemId, estreno, 'upcoming');
        });
    });
}

// Listener para filtrar estrenos
document.getElementById('estrenosSortOrder').addEventListener('change', function () {
    const container = document.getElementById('upcoming-movies');
    let estrenosItems = JSON.parse(container.getAttribute('data-items'));
    const order = this.value;

    estrenosItems.sort((a, b) => {
        if (order === 'desc') {
            return b.vote_average - a.vote_average;
        } else {
            return a.vote_average - b.vote_average;
        }
    });

    displayUpcomingMovies(estrenosItems, 'movie');
});


// Obtener datos de series
fetchDataAndDisplay(TV_URL, displaySeries, 'tv');

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

//Mostrar review de series
function showSeriesReview(seriesId, series) {
    const serie = series.find(s => s.id == seriesId);

    if (!serie) {
        console.error(`Series with ID ${seriesId} not found.`);
        return;
    }

    showModal(seriesId, series, 'series');
}

//Filtrar series
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


//mostrar modal

function showModal(itemId, items, type) {
    const item = items.find(i => i.id == itemId);
    if (!item) {
        console.error(`Item with ID ${itemId} not found.`);
        return;
    }

    let modalTitle, modalReview, modalId;

    if (type === 'movie' || type === 'upcoming') {
        modalTitle = document.getElementById('movieModalLabel');
        modalReview = document.getElementById('movieReview');
        modalId = 'movieModal';
    } else if (type === 'series') {
        modalTitle = document.getElementById('seriesModalLabel');
        modalReview = document.getElementById('seriesReview');
        modalId = 'seriesModal';
    }

    if (modalTitle && modalReview) {
        modalTitle.textContent = item.title || item.name || 'Unknown Title';
        
        // Limpiar contenido previo y agregar overview
        modalReview.innerHTML = item.overview || `No hay review disponible para esta ${type}.`;

        // Constructor de boton favoritos
        const favoritosBtn = document.createElement('button');
        favoritosBtn.textContent = 'Agregar a Favoritos';
        favoritosBtn.classList.add('btn', 'btn-danger');
        favoritosBtn.addEventListener('click', () => AgregarAFavoritos(item));

        // Añadir salto de línea y boton a modalReview
        const saltoDeLinea = document.createElement('br');
        modalReview.appendChild(saltoDeLinea);
        modalReview.appendChild(favoritosBtn);

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    } else {
        console.error('Elementos del modal no encontrados');
    }
}


// interacciones

// Agregar a favoritos
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

// Mostrar favoritos
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