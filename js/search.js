// search.js
import { TMDB_API_KEY } from './config.js';
import { displayUserInfo } from './main.js';
import { auth } from './config.js';


document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        fetchMovies(query);
    }
});

// Hàm lấy dữ liệu phim từ API
async function fetchMovies(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    displayMovies(data.results);
}

// Hàm hiển thị kết quả tìm kiếm lên giao diện
function displayMovies(movies) {
    const movieList= document.getElementById("movies");
    movieList.innerHTML = ''; // Xóa dữ liệu cũ trước khi thêm dữ liệu mới

    if (movies.length === 0) {
        movieList.innerHTML = `<h4>No movies found</h4>`;
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('a');
        movieCard.classList.add('movie-item');
        movieCard.setAttribute('href', `./info.html?id=${movie.id}`);
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;
        movieList.appendChild(movieCard);
    });
}


// Lắng nghe sự thay đổi trạng thái đăng nhập
auth.onAuthStateChanged((user) => {
    displayUserInfo(user);
  });
  