// info.js
import { TMDB_API_KEY } from './config.js';
import { db, auth } from './config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { displayUserInfo } from './main.js';


// Lấy ID phim từ URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Kiểm tra nếu không có ID phim thì chuyển về trang chủ
if (!movieId) {
    window.location.href = 'index.html';
}

// Hàm lấy thông tin chi tiết phim từ API
async function fetchMovieDetails() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data;
}

// Hàm lấy danh sách diễn viên từ API
async function fetchCast() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    console.log(data.cast)
    return data.cast;
}

// Hàm lấy phim tương tự từ API
async function fetchSimilarMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results;
}

// Hiển thị thông tin chi tiết của phim
function displayMovieDetails(movie) {
    document.getElementById('movie-title').innerText = movie.title;
    document.getElementById('movie-description').innerText = movie.overview;
    document.getElementById('preview-img').src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    document.getElementById('watch-now-btn').href = `https://www.youtube.com/results?search_query=${movie.title}+trailer`;
}

// Hiển thị danh sách diễn viên
function displayCast(cast) {
    const castGrid = document.querySelector('.casts-grid');
    castGrid.innerHTML = '';

    castGrid.innerHTML = cast.map(item => {
        return `
        <div>
            <img src="https://image.tmdb.org/t/p/w200${item.profile_path}" alt="${item.name}">
            <p>${item.name}</p>
            <p">${item.character}</p>
        </div>
        `
    }).join('')


}

// Hiển thị phim tương tự
function displaySimilarMovies(movies) {
    const similarSection = document.getElementById('similar-movie');
    similarSection.innerHTML = '';

    if (movies.length > 0) {
        similarSection.innerHTML = movies.map(item => {
            return `
                <a href="./info.html?id=${item.id}" class="swiper-slide">
                    <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title}">
                    <p>${item.title}</p>
                </a>
            `
        }).join('');
    } else {
        similarSection.innerHTML = '<h4>No similar movies found.</h4>';
    }
}


// Hàm lấy và hiển thị bình luận của một bộ phim từ Firestore
async function fetchComments() {
    try {
        // Tạo một truy vấn để lấy dữ liệu từ Firestore.
        // `collection(db, movie-comments-${movieId})`: Tham chiếu đến bộ sưu tập chứa bình luận của bộ phim, tên bộ sưu tập được định danh dựa trên `movieId`.
        // `orderBy("createdAt", "desc")`: Sắp xếp các bình luận theo trường `createdAt` (ngày tạo) theo thứ tự giảm dần (mới nhất trước).
        const q = query(
            collection(db, `movie-comments-${movieId}`),
            orderBy("createdAt", "desc") // Sắp xếp giảm dần theo createAt (ngày cmt)
        );

        // `onSnapshot`: Lắng nghe thay đổi theo thời gian thực trên truy vấn `q`.
        // Mỗi khi có thay đổi trong bộ sưu tập, callback được gọi với kết quả truy vấn mới. 
        // querySnapshot: Là toàn bộ tập hợp các tài liệu (nếu có) trả về từ truy vấn q.
        onSnapshot(q, (querySnapshot) => {
            // Tạo một mảng rỗng để lưu trữ dữ liệu bình luận.
            const comments = [];

            // `querySnapshot.forEach`: Lặp qua từng tài liệu trong kết quả truy vấn.
            querySnapshot.forEach((doc) => {
                // `doc.data()`: Lấy dữ liệu của từng bình luận và thêm vào mảng `comments`.
                comments.push(doc.data());
            });
            console.log(comments)
            // `displayComments(comments)`: Gọi hàm hiển thị bình luận với dữ liệu vừa thu thập được.
            displayComments(comments);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}


// Hiển thị bình luận
function displayComments(comments) {
const commentContainer = document.getElementById('comments');
commentContainer.innerHTML = '';

commentContainer.innerHTML = comments.map(cmt => {
    return `
        <div class="comment-content">
            <img id="avatar-commnet" src="${cmt.user.photoURL}" alt="avatar">
                <div class="comment-item">
                    <div class="commnet-text">
                        <strong>${cmt.user.email}</strong>
                        <p>${cmt.title}</p>
                    </div>
                <p>${new Date(cmt.createdAt.seconds * 1000).toLocaleString()}</p>
            </div>
        </div>
        `
        }).join("");
}

// Xử lý sự kiện khi người dùng gửi bình luận
function handleCommentSubmit(event) {
    // Ngăn hành vi mặc định của form (tải lại trang khi submit)
    event.preventDefault();

    // Lấy phần tử input để nhập bình luận từ HTML thông qua ID 'comment-input'
    const commentInput = document.getElementById('comment-input');
    // Lấy nội dung bình luận từ input và loại bỏ khoảng trắng thừa ở đầu và cuối
    const commentText = commentInput.value.trim();

    // Kiểm tra nếu có nội dung bình luận (không phải chuỗi rỗng)
    if (commentText) {
        // Thêm bình luận vào Firestore trong collection được đặt tên động dựa trên movieId
        addDoc(
            collection(db, `movie-comments-${movieId}`), // Truy cập collection Firestore
            {
                // Thêm một tài liệu mới với các trường sau:
                title: commentText, // Nội dung bình luận
                user: { // Thông tin người dùng hiện tại
                    uid: auth.currentUser.uid, // UID của người dùng
                    email: auth.currentUser.email, // Tên hiển thị của người dùng
                    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent( auth.currentUser.email || "Guest")}`, // Ảnh đại diện của người dùng
                },
                createdAt: serverTimestamp(), // Thời gian bình luận được tạo (lấy từ server)
            }
        ).catch((error) => {
            // Nếu có lỗi xảy ra khi thêm bình luận, in lỗi ra console
            console.error("Error adding comment: ", error);
        });

        // Xóa nội dung trong input để người dùng có thể nhập bình luận mới
        commentInput.value = '';
    }
}


// Lắng nghe trạng thái đăng nhập của người dùng trên Firebase Authentication
onAuthStateChanged(auth, (user) => {
    // Kiểm tra nếu người dùng đã đăng nhập (user không phải null)
    if (user) {
        // Nếu người dùng đã đăng nhập, hiển thị hộp nhập bình luận
        document.getElementById('comment-box-container').innerHTML = `
            <img id="avatar-commnet" src="./assets/images/avatar_default.jpg" alt="avatar">
            <form id="comment-form">
                <!-- Ô nhập liệu cho bình luận -->
                <input id="comment-input" placeholder="Add your comment..." required>
                <!-- Nút gửi bình luận -->
                <button type="submit"><i class="fa fa-paper-plane"></i></button>
            </form>
        `;

        // Gắn sự kiện submit cho form bình luận
        document.getElementById('comment-form').addEventListener('submit', handleCommentSubmit);
    } else {
        // Nếu người dùng chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
        document.getElementById('comment-box-container').innerHTML = `
            <p>You need to be logged in to comment.</p>
        `;
    }
});


// Lấy và hiển thị thông tin bình luận
fetchComments();

// Lấy và hiển thị thông tin phim
fetchMovieDetails().then(displayMovieDetails)

// Lấy và hiển thị diễn viên
fetchCast().then(displayCast);

// Lấy và hiển thị phim tương tự
fetchSimilarMovies().then(displaySimilarMovies);


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