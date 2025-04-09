const registerForm = document.querySelector("#register-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");

const userNameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confrimError = document.querySelector("#confirm-password-error");

const userLocal = JSON.parse(localStorage.getItem("users")) || [];

function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function validatePassword(password) {
    return password.length >= 8; 
};

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!nameInput.value) {
        userNameError.style.display = "block";
    }else {
        userNameError.style.display = "none";
    }

    if (!emailInput.value) {
        emailError.style.display = "block";
    }else {
        emailError.style.display = "none";
        if (!validateEmail(emailInput.value)) {
            emailError.style.display = "block";
            emailError.innerHTML = "Email không đúng định dạng"
        }
    }

    if (!passwordInput.value) {
        passwordError.style.display = "block";
    }else {
        passwordError.style.display = "none";
        if (!validatePassword(passwordInput.value)) {
            passwordError.style.display = "block";
            passwordError.innerHTML = "Mật khẩu phải có ít nhất 8 ký tự";
        }
    }

    if (!confirmPasswordInput.value) {
        confrimError.style.display = "block";
    }else {
        confrimError.style.display = "none";
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        confrimError.style.display = "block";
        confrimError.innerHTML = "Mật khẩu không khớp"
    }else{
        confrimError.style.display = "none";
    }

    if (nameInput.value && emailInput.value && passwordInput.value && confirmPasswordInput.value && passwordInput.value === confirmPasswordInput.value && validateEmail(emailInput.value) && validatePassword(passwordInput.value)) {
        const user = {
            userName: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,    
        }

        Swal.fire({
            text: "Đăng ký thàng cổng",
            icon: "success"
        }).then(() => {
            userLocal.push(user);
        localStorage.setItem("users", JSON.stringify(userLocal));       
        window.location.href = "../pages/login.html"
        });

    }
});