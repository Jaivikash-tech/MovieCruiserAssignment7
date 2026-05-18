let movieItems = [];
let favItems = [];

const moviesApiUrl = 'http://localhost:3000/movies';
const favouritesApiUrl = 'http://localhost:3000/favourites';

const movieHtml = (movie, text, btnClass, fnName, value) => `

<div class="col-md-6 mb-4">

    <div class="card border-0 shadow-sm movie-card h-100">

        <div class="text-center p-3">

            <img 
                src="${movie.posterPath}" 
                alt="${movie.title}"
                class="img-fluid movie-poster"
            >

        </div>

        <div class="card-body text-center">

            <h5 class="card-title fw-bold mb-2">
                ${movie.title}
            </h5>

            <p class="card-text text-muted mb-3">
                Release Year : ${movie.releaseDate || ''}
            </p>

            <button 
                class="btn ${btnClass} movie-btn"
                onclick="${fnName}('${value}')"
            >
                ${text}
            </button>

        </div>

    </div>

</div>

`;

const createMovieList = () => {

    document.getElementById('moviesList').innerHTML = `

        <div class="row">

            ${movieItems.map((movie) =>
                movieHtml(
                    movie,
                    'Add to Favourite',
                    'btn-primary',
                    'addFavourite',
                    movie.id
                )
            ).join('')}

        </div>

    `;
};

const createFavouriteList = () => {

    document.getElementById('favouritesList').innerHTML = `

        <div class="row">

            ${favItems.map((movie) =>
                movieHtml(
                    movie,
                    'Remove',
                    'btn-outline-danger',
                    'removeFavourite',
                    movie.id
                )
            ).join('')}

        </div>

    `;
};

const getMovies = () => fetch(moviesApiUrl)

    .then((response) => response.json())

    .then((movies) => {

        movieItems = movies;

        createMovieList();

        return movies;

    });

function getFavourites() {

    return fetch(favouritesApiUrl)

        .then((response) => response.json())

        .then((favourites) => {

            favItems = favourites;

            createFavouriteList();

            return favourites;

        });
}

function addFavourite(id) {

    const movie = movieItems.find((item) => item.id == id);

    if (!movie) {
        return;
    }

    if (favItems.some((item) => item.title === movie.title)) {
        return;
    }

    return fetch(favouritesApiUrl, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(movie)

    })

    .then((response) => response.json())

    .then((addedMovie) => {

        favItems.push(addedMovie);

        createFavouriteList();

        return favItems;

    });
}

function removeFavourite(id) {

    const confirmDelete = confirm(
        "Do you want to remove this movie from favourites?"
    );

    if (!confirmDelete) {
        return;
    }

    return fetch(`${favouritesApiUrl}/${id}`, {

        method: 'DELETE'

    })

    .then(() => {

        favItems = favItems.filter((item) => item.id != id);

        createFavouriteList();

    });
}

if (typeof window !== 'undefined') {

    window.getMovies = getMovies;
    window.getFavourites = getFavourites;
    window.addFavourite = addFavourite;
    window.removeFavourite = removeFavourite;
}

if (typeof module !== 'undefined' && module.exports) {

    module.exports = {
        getMovies,
        getFavourites,
        addFavourite,
        removeFavourite
    };
}