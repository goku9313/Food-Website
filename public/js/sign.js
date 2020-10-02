const signIn = document.getElementsByClassName("sign")[0];
const signUp = document.getElementsByClassName("sign")[1];
const name = document.getElementsByClassName("name")[0];
const check = document.getElementsByClassName("check")[0];
const submit = document.getElementsByClassName("submit")[0];
const forgetPassword = document.getElementsByClassName("pw")[0];
const confirmpassword = document.getElementsByClassName("confirmpw")[0];
// Backend part
const nameInput = document.getElementById("name");
const emailinput = document.getElementById("email");
const passwordInput = document.getElementById("pw");
const checkInput = document.getElementById("checkbox");
const confirmPW = document.getElementById("pwChecker");
const submitForm = document.getElementsByClassName("signup")[0];

// Continous password checker
function checker() {
    if (confirmPW.value == passwordInput.value) {
        confirmPW.style.border = "2px solid darkcyan";
    } else {
        confirmPW.style.border = "2px solid red";
    }
}
passwordInput.onkeyup = checker;
confirmPW.onkeyup = checker;

signIn.addEventListener("click", function (e) {
    name.style.display = "none";
    nameInput.required = false;
    check.style.display = "none";
    checkInput.required = false;
    confirmpassword.style.display = "none";
    confirmPW.required = false;
    forgetPassword.style.display = "block";
    submit.textContent = "Sign In"
    signUp.classList.remove("selected");
    this.classList.add("selected");
    nameInput.value = "";
    passwordInput.value = "";
    emailinput.value = "";
    confirmPW.value = "";
    checkInput.checked = false;
});
signUp.addEventListener("click", function (e) {
    name.style.display = "block";
    nameInput.required = true;
    check.style.display = "flex";
    checkInput.required = true;
    confirmpassword.style.display = "block";
    confirmPW.required = true;
    forgetPassword.style.display = "none";
    submit.textContent = "Sign Up";
    signIn.classList.remove("selected");
    this.classList.add("selected");
    nameInput.value = "";
    passwordInput.value = "";
    emailinput.value = "";
    confirmPW.value = "";
    checkInput.checked = false;
});
async function loginHelper(email, password) {
    const response = await axios.post("/api/users/login", {
        email,
        password
    });
    if (response.data.status == "User logged in") {
        window.location.href = "/";
    } else {
        alert(response.data.status);
    }
}
async function signupHelper(name, email, password, confirmPassword) {
    const response = await axios.post("/api/users/signup", {
        name,
        email,
        password,
        confirmPassword,
    });
    if (response.data.status == "User created and email verification sent to user's email address.") {
        window.location.href = "/";
    } else {
        alert(response.data.status);
    }
}
// Submit
submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (confirmPW.value.length == 0) {
        loginHelper(emailinput.value, passwordInput.value);
    } else {
        if (confirmPW.value != passwordInput.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            signupHelper(nameInput.value, emailinput.value, passwordInput.value, confirmPW.value);
        }
    }
});