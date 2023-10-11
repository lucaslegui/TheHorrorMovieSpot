const API_KEY = '1ecc8c3efdbe45d62be8a5cc30f07bcd'; // API Key
const GENRE_ID_HORROR = 27; // Genero de terror
const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${GENRE_ID_HORROR}&sort_by=popularity.desc&language=es-MX`;

fetch(URL)
    .then(response => response.json())
    .then(data => {
        const movies = data.results;
        displayMovies(movies);
    })
    .catch(error => {
        console.error("Error al obtener las películas:", error);
    });

//funcion para mostrar las peliculas

document.getElementById('sortOrder').addEventListener('change', function() {
    const moviesContainer = document.getElementById('recommended-movies');
    let movies = JSON.parse(moviesContainer.getAttribute('data-movies')); // Obtenemos las peliculas almacenadas en el elemento como un atributo.
    const order = this.value; // Obtener el orden seleccionado

    // Ordenar las películas
    movies.sort((a, b) => {
        if(order === 'desc') {
            return b.vote_average - a.vote_average;
        } else {
            return a.vote_average - b.vote_average;
        }
    });

    displayMovies(movies); // Mostrar las películas ordenadas
});


function displayMovies(movies) {
    const moviesContainer = document.getElementById('recommended-movies');
    moviesContainer.setAttribute('data-movies', JSON.stringify(movies));
    let moviesHTML = '';
    
    movies.forEach(movie => {
        moviesHTML += `
        <div class="card" data-movie-id="${movie.id}">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="card-inner">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h4>${movie.title}</h4>
          <p>Calificación:<i class="fa-solid fa-star fa-beat" style="color: #f7ef02;"></i> ${movie.vote_average}/10</p>
        </div>
        </div>
      `;
    });

    moviesContainer.innerHTML = moviesHTML;
    // evento al hacer clic en la tarjeta
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            const movieId = card.getAttribute('data-movie-id');
            showMovieReview(movieId, movies);
        });
    });
}

//mostrar modal de pelicula
function showMovieReview(movieId, movies) {
    //  buscar pelicula por id
    const movie = movies.find(m => m.id == movieId);

    // data para el modal
    const modalTitle = document.getElementById('movieModalLabel');
    const modalReview = document.getElementById('movieReview');

    modalTitle.textContent = movie.title;
    modalReview.textContent = movie.overview || "No hay review disponible para esta película.";

    // mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
}



