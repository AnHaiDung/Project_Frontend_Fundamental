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

if (localStorage.getItem("loggedInUser")) {
    window.history.back()
}


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

    userNameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
    confrimError.style.display = "none";

    let emailExists = userLocal.some(user => user.email === emailInput.value);

    if (!nameInput.value) {
        userNameError.style.display = "block";
    }

    if (!emailInput.value) {
        emailError.style.display = "block";
    } else if (!validateEmail(emailInput.value)) {
        emailError.style.display = "block";
        emailError.innerHTML = "Email không đúng định dạng";
    } else if (emailExists) {
        emailError.style.display = "block";
        emailError.innerHTML = "Email này đã được đăng ký";
    }

    if (!passwordInput.value) {
        passwordError.style.display = "block";
    } else if (!validatePassword(passwordInput.value)) {
        passwordError.style.display = "block";
        passwordError.innerHTML = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (!confirmPasswordInput.value) {
        confrimError.style.display = "block";
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        confrimError.style.display = "block";
        confrimError.innerHTML = "Mật khẩu không khớp";
    }

    if (
        nameInput.value && 
        emailInput.value && 
        passwordInput.value && 
        confirmPasswordInput.value && 
        passwordInput.value === confirmPasswordInput.value && 
        validateEmail(emailInput.value) && 
        validatePassword(passwordInput.value) && 
        !emailExists
    ) {
        const user = {
            userName: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

        Swal.fire({
            text: "Đăng ký thành công",
            icon: "success"
        }).then(() => {
            userLocal.push(user);
            localStorage.setItem("users", JSON.stringify(userLocal));       
            window.location.href = "../pages/login.html";
        });
    }
});
