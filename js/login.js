const loginForm = document.querySelector("#login-form");
const loginEmailInput = document.querySelector("#login-email");
const loginPasswordInput = document.querySelector("#login-password");

const loginEmailError = document.querySelector("#login-email-error");
const loginPasswordError = document.querySelector("#login-password-error");

const users = JSON.parse(localStorage.getItem("users")) || [];

const admin = {
    email: "admin@gmail.com",
    password: "admin123"
};

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    if (!loginEmailInput.value) {
        loginEmailError.style.display = "block";
        isValid = false;
    } else {
        loginEmailError.textContent = "";
        loginEmailError.style.display = "none";
    }

    if (!loginPasswordInput.value) {
        loginPasswordError.style.display = "block";
        isValid = false;
    } else {
        loginPasswordError.textContent = "";
        loginPasswordError.style.display = "none";
    }

    if (isValid) {
        if (loginEmailInput.value === admin.email && loginPasswordInput.value === admin.password) {
            window.location.href = "../pages/dashboard.html";
        } else {
            var foundUser = users.find(function(user) {
                return user.email === loginEmailInput.value && user.password === loginPasswordInput.value;
            });
    
            if (foundUser) {
                window.location.href = "../pages/category-manager.html";
            } else {
                loginPasswordError.textContent = "Email hoặc mật khẩu không đúng";
                loginPasswordError.style.display = "block";
            }
        }
    }

});



