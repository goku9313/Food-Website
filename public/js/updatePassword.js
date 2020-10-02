const passwordInput = document.getElementById("p1");
const confirmPW = document.getElementById("p2");
const form = document.querySelector("form");
const warning = document.getElementsByClassName("warning")[0];

function checker() {
    warning.style.display = "none";
    if (confirmPW.value.length == 0 && passwordInput.value.length == 0) {
        confirmPW.style.border = "1px solid black";
        return false;
    } else if (confirmPW.value == passwordInput.value) {
        confirmPW.style.border = "1px solid chartreuse";
        return true;
    } else {
        confirmPW.style.border = "1px solid red";
        return false;
    }
}
passwordInput.onkeyup = checker;
confirmPW.onkeyup = checker;

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (checker()) {
        const path = window.location.href.split("/").pop();
        const response = await axios.patch("/api/users/updatePassword/" + path, {
            password: passwordInput.value,
            confirmPassword: confirmPW.value
        });
        if (response.data.status) {
            window.location.href = "/passUpdated";
        } else {
            warning.style.display = "block";
        }
    } else {
        warning.style.display = "block";
    }
});