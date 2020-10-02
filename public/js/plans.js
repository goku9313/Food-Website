// Zoomed in photo slideshow
const zoomedInState = document.getElementById("zoomed-in-photo");
const zoomedInImage = document.getElementsByClassName("zoomed-in-image")[0];
const images = document.getElementsByClassName("secondary-image");
const popBlock = document.getElementById("pop-up-block");
const popMessage = document.getElementsByClassName("pop-up-message")[0];
for (var i = 0; i < images.length; i++) {
    images[i].addEventListener("click", function (e) {
        zoomedInImage.setAttribute("src", `${this.src}`);
        zoomedInState.style.display = "flex";
    });
}
const cross = document.getElementsByClassName("cross")[0];
cross.addEventListener("click", function (e) {
    zoomedInImage.setAttribute("src", "");
    zoomedInState.style.display = "none";
});
const leftShift = document.getElementsByClassName("left")[0];
const rightShift = document.getElementsByClassName("right")[0];
leftShift.addEventListener("click", function (e) {
    const list = zoomedInImage.src.split("/");
    var path = "/" + list.slice(3).join("/");
    const img = document.querySelectorAll(`img[src='${path}']`)[0];
    if (img.previousSibling == null) {
        const copy = img.parentElement.lastChild;
        zoomedInImage.setAttribute("src", `${copy.src}`);
    } else
        zoomedInImage.setAttribute("src", `${img.previousSibling.src}`);
});
rightShift.addEventListener("click", function (e) {
    const list = zoomedInImage.src.split("/");
    var path = "/" + list.slice(3).join("/");
    const img = document.querySelectorAll(`img[src='${path}']`)[0];
    if (img.nextSibling == null) {
        const copy = img.parentElement.firstChild;
        zoomedInImage.setAttribute("src", `${copy.src}`);
    } else {
        zoomedInImage.setAttribute("src", `${img.nextSibling.src}`);
    }
});
// Like button
const likeButtons = document.getElementsByClassName("like-button");
for (var i = 0; i < likeButtons.length; i++) {
    likeButtons[i].addEventListener("click", async function (e) {
        const response = await axios.patch("/api/users/updateLiked", {
            planId: this.getAttribute("planid"),
        });
        if (response.data.status) {
            if (this.style.color == "orangered") {
                this.style.setProperty('color', 'grey', 'important');;
                popMessage.textContent = "Item removed from Wish List";
                popUp();
            } else {
                this.style.setProperty('color', 'orangered', 'important');
                popMessage.textContent = "Item added to Wish List";
                popUp();
            }
        } else {
            alert("Please login to like a plan.");
        }
    });
}
// Add to cart button
const addToCart = document.getElementsByClassName("hungry");
for (var i = 0; i < addToCart.length; i++) {
    addToCart[i].addEventListener("click", async function (e) {
        const response = await axios.patch("/api/users/addToCart", {
            planId: this.getAttribute("planid"),
        });
        if (!response.data.status) {
            alert("Please login to add to cart.");
        } else {
            popMessage.textContent = "Item added to cart";
            popUp();
        }
    });
}
// Pop up message
function popUp() {
    popBlock.style.display = "flex";
    popBlock.style.top = "90%";
    setTimeout(function () {
        popBlock.style.top = "100%";
        popBlock.style.display = none;
    }, 2000);
}