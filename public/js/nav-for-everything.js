const name = document.getElementsByClassName("usertag")[0];
const photo = document.getElementsByClassName("user-photo")[0];
const menu = document.getElementsByClassName("drop-down-menu")[0];
var menuOpen = false;
if (name) {
    name.addEventListener("click", menuOpener);
}
if (photo) {
    photo.addEventListener("click", menuOpener);
}

function menuOpener(e) {
    e.preventDefault();
    if (menuOpen) {
        menu.style.height = "0rem";
        menuOpen = false;
    } else {
        menu.style.height = "9.5rem";
        menuOpen = true;
    }
}