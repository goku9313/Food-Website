// Mobile drop-down menu
var isOpen = false;
const drop = document.getElementsByClassName("arrow")[0];
if (window.innerWidth <= 720) {
    drop.addEventListener("click", function (e) {
        const list = this.parentElement.parentElement;
        if (isOpen) {
            isOpen = false;
            list.style.top = "-192px";
            drop.style.transform = "rotate(0deg)";
        } else {
            isOpen = true;
            list.style.top = "0px";
            drop.style.transform = "rotate(180deg)";
        }
    });

}
const name = document.getElementById("name");
const menu = document.getElementsByClassName("menu")[0];
var menuOpen = false;
if (name) {
    name.addEventListener("click", function (e) {
        e.preventDefault();
        if (menuOpen) {
            menu.style.height = "0rem";
            menuOpen = false;
        } else {
            menu.style.height = "9.5rem";
            menuOpen = true;
        }
    });
}