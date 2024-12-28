// auth.js
import { auth } from './config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js'

// Xử lý đăng nhập
const signIn = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }

    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        console.log('Login successful:', user);
        window.location.href = '/';  // Chuyển hướng về trang chủ sau khi đăng nhập
    } catch (error) {
        console.error("Error during sign in:", error.message);
        alert("Login failed: " + error.message);
    }
};

// Xử lý đăng ký
const signUp = async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        console.log('Signup successful:', user);
        alert("Account created successfully!");
        window.location.href = '/login.html';  // Chuyển hướng đến trang đăng nhập
    } catch (error) {
        console.error("Error during sign up:", error.message);
        alert("Signup failed: " + error.message);
    }
};

// Xử lý đăng xuất
export const handleSignOut = async () => {
    try {
        await signOut(auth);
        console.log('Sign out successful');
        document.getElementById('avatar-action-container').innerHTML = `
            <i class="fa fa-user-alt" id="login-icon"></i>
        `;
        window.location.href='login.html'
    } catch (error) {
        console.error("Error during sign out:", error.message);
    }
};

// Xử lý sự kiện submit form đăng nhập
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Chặn hành động mặc định của form
        signIn();
    });
}

// Xử lý sự kiện submit form đăng ký
if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Chặn hành động mặc định của form
        signUp();
    });
}
