const form = document.getElementsByTagName("form")[0];
const emailReset = document.getElementsByClassName("input-reset")[0];
const message = document.getElementsByClassName("warning")[0];
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const response = await axios.patch("/api/users/forgetPassword", {
        email: emailReset.value,
    });
    if (response.data.status) {
        window.location.href = "/resetSuccessful";
    } else {
        message.style.display = "block";
    }
});

emailReset.onclick = function () {
    message.style.display = "none";
}