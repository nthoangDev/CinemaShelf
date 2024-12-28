import { TMDB_API_KEY, auth } from "./config.js"
import { handleSignOut } from './auth.js'

document.querySelector('.menu-toggle').addEventListener('click', () => {
  const navContainer = document.querySelector('.nav-container');
  navContainer.classList.toggle('active');

})


const fetchTrending = async (timeWindow) => {
  const url = `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw Error("Network was not ok ", response.status)
    }
    const data = await response.json();
    // console.log(data.results)
    return data.results;

  } catch (e) {
    console.log("Error ", e)
  }
}

const displayTrendingMovie = (movies) => {
  const movieTrend = document.getElementById('trend-movie');
  movieTrend.innerHTML = '';


  movieTrend.innerHTML = movies.map(movie => {
    return `
        <a href="./info.html?id=${movie.id}"  class="swiper-slide">
          <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        </a>

    `
  }).join("");
}

const fetchPopular = async () =>{
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`;

  try{
    let resp = await fetch(url);
    if(!resp.ok){
      throw new Error("Network was not ok", resp.status)
    }

    let data = await resp.json();
    console.log(data.results)
    return data.results;
  }catch(e){
    console.log("Error", e)
  }
}

const displayPopularMovie = (movies)=>{
  const popularMovie = document.getElementById('popular-movie');
  popularMovie.innerHTML = '';

  popularMovie.innerHTML = movies.map(item =>{
    return `
      <a href="./info.html?id=${item.id}" class="movie-card">
        <img src="https://image.tmdb.org/t/p/w200/${item.poster_path}" alt="${item.title}">
        <p>${item.title}</p>
      </a>
    `
  }).join('');
}

fetchTrending('day').then(displayTrendingMovie);

fetchPopular().then(displayPopularMovie);


// Hiển thị thông tin người dùng sau khi đăng nhập
export function displayUserInfo(user) {
  const avatarContainer = document.getElementById('avatar-action-container');

  if (user) {
    const avatarURL = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email || "Guest")}`;
    avatarContainer.innerHTML = `
        <div class="user-info">
            <img src="${avatarURL}" alt="Avatar" class="user-avatar" />
            <p>${user.email}</p>
            <button class="action-button" id="logout-button">Logout</button>
        </div>
    `;
    document.getElementById('logout-button').addEventListener('click', handleSignOut); // Lắng nghe sự kiện click
  } else {
    avatarContainer.innerHTML = `
        <i class="fa fa-user-alt" id="login-icon"></i>
    `;
    // Lắng nghe sự kiện click và chuyển hướng đến trang login.html
    document.getElementById('login-icon').addEventListener('click', () => {
        window.location.href = 'login.html';  // Chuyển hướng đến trang đăng nhập
    });
  }
}


// Lắng nghe sự thay đổi trạng thái đăng nhập
auth.onAuthStateChanged((user) => {
  displayUserInfo(user);
});








const swiper = new Swiper('.swiper', {
  spaceBetween: 30,
  autoplay: { delay: 5000, disableOnInteraction: true },
  slidesPerView: "auto",
  loop: true,
  slidesPerGroupAuto: true,
  navigation: {
    prevEl: `.swiper-button-prev`,
    nextEl: `.swiper-button-next`,
  },
});