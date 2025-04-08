const loginForm = document.querySelector("#login-form");
const loginEmailInput = document.querySelector("#login-email");
const loginPasswordInput = document.querySelector("#login-password");

const loginEmailError = document.querySelector("#login-email-error");
const loginPasswordError = document.querySelector("#login-password-error");

const users = JSON.parse(localStorage.getItem("users")) || [];

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
        const foundUser = users.find(user => 
            user.email === loginEmailInput.value && user.password === loginPasswordInput.value
        );

        if (foundUser) {
            window.location.href = "../pages/dashboard.html";
        } else {
            loginPasswordError.textContent = "Email hoặc mật khẩu không đúng";
            loginPasswordError.style.display = "block";
        }
    }
});
