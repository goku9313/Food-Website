// Remove plan
const cost = document.getElementsByClassName("totalCost")[0];
const cross = document.getElementsByClassName("cross");
for (var i = 0; i < cross.length; i++) {
    cross[i].addEventListener("click", async function (e) {
        var oldCost = parseInt(cost.getAttribute("totalCost"));
        var planCost = parseInt(this.getAttribute("cost"));
        const response = await axios.patch("/api/users/removeFromCart", {
            planId: this.getAttribute("planid"),
        });

        if (response.data.status) {
            this.parentElement.style.display = "none";
            cost.textContent = `${oldCost-planCost*response.data.quantity}$`;
            cost.setAttribute("totalCost", `${oldCost-planCost*response.data.quantity}`);
        } else {
            alert("Unable to remove plan, try again later !");
        }
    });
}
// Increase Decrease
const inc = document.getElementsByClassName("increase");
const dec = document.getElementsByClassName("decrease");
for (var i = 0; i < inc.length; i++) {
    inc[i].addEventListener("click", async function (e) {
        var oldCost = parseInt(cost.getAttribute("totalCost"));
        var planCost = parseInt(this.getAttribute("cost"));
        const response = await axios.patch("/api/users/increaseQuantity", {
            planId: this.getAttribute("planid"),
        });
        if (!response.data.status) {
            alert("Unable to increase quantity, try again later !");
        } else {
            cost.textContent = `${oldCost+planCost}$`;
            cost.setAttribute("totalCost", `${oldCost + planCost}`);
            this.nextSibling.textContent = `${response.data.quantity}`;
        }
    });
}
for (var i = 0; i < dec.length; i++) {
    dec[i].addEventListener("click", async function (e) {
        var oldCost = parseInt(cost.getAttribute("totalCost"));
        var planCost = parseInt(this.getAttribute("cost"));
        const response = await axios.patch("/api/users/decreaseQuantity", {
            planId: this.getAttribute("planid"),
        });
        if (!response.data.status) {
            alert("Unable to decrease quantity, try again later !");
        } else {
            cost.textContent = `${oldCost-planCost}$`;
            cost.setAttribute("totalCost", `${oldCost - planCost}`);
            if (response.data.remove) {
                this.parentElement.parentElement.parentElement.style.display = "none";
            } else {
                this.previousSibling.textContent = `${response.data.quantity}`;
            }
        }
    })
}