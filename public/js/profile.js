// Menu clicks
const featuresList = document.getElementsByClassName("features-list")[0];
const loader2 = document.getElementsByClassName("lds-dual-ring")[1];
const imageChanger = document.getElementById("input-for-profile-pic");

if (imageChanger) {
    imageChanger.addEventListener("change", async function (e) {
        e.preventDefault();
        const multipartFormData = new FormData();
        multipartFormData.append("photo", imageChanger.files[0]);
        const response = await axios.patch("api/users/changePhoto", multipartFormData);
        if (response.data.status) {
            location.reload();
        } else {
            alert("Unable to update photo. Please try again later");
        }
    });
}

featuresList.addEventListener("click", function (e) {
    const c = e.target.classList.value.split(" ")[e.target.classList.length - 1];
    const pages = document.getElementsByClassName("main-right");
    for (var i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (page.classList.contains(c)) {
            addEvent(page.classList.value.split(" ")[0]);
            page.classList.remove("closed");
            page.classList.add("open");
        } else if (page.classList.contains("open")) {
            page.classList.remove("open");
            page.classList.add("closed");
        }
    }
});

function addEvent(c) {
    if (c.localeCompare("info-edit") == 0) {
        const editForm = document.getElementsByClassName("edit-form")[0];
        const name = document.getElementById("username");
        const email = document.getElementById("email");
        editForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            showLoader2();
            const response = await axios.patch("/api/users/updateMe", {
                name: name.value,
                email: email.value,
            });
            hideLoader2();
            alert(response.data.status);
        })
    } else if (c.localeCompare("add-plan") == 0) {
        const planForm = document.getElementsByClassName("plan-form")[0];
        const planname = document.getElementById("planname");
        const price = document.getElementById("price");
        const rating = document.getElementById("rating");
        const features = document.getElementById("features-list");
        const duration = document.getElementById("duration");
        const discount = document.getElementById("discount");
        const coverFile = document.getElementById("cover-image-input");
        const secondaryImages = document.getElementById("secondary-images-input");
        planForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            if (secondaryImages.files.length == 3) {
                // showLoader2();
                const multipartFormData = new FormData();
                multipartFormData.append("cover", coverFile.files[0]);
                for (var i = 0; i < 3; i++)
                    multipartFormData.append("secondary", secondaryImages.files[i]);
                multipartFormData.append("name", planname.value);
                multipartFormData.append("duration", duration.value);
                multipartFormData.append("price", price.value);
                multipartFormData.append("ratingsAverage", rating.value);
                multipartFormData.append("features", features.value);
                multipartFormData.append("discount", discount.value);
                const response = await axios.post("/api/plans/createPlan", multipartFormData);
                // hideLoader2();
                alert(response.data.status);
            } else
                alert("Please select exactly 3 secondary photos");
        });

    } else if (c.localeCompare("pass-edit") == 0) {
        const passForm = document.getElementsByClassName("pass-form")[0];
        const password = document.getElementById("password");
        const confirmpw = document.getElementById("confirmPW");
        passForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            if (password.value == confirmpw.value) {
                showLoader2();
                const response = await axios.patch("/api/users/changePassword", {
                    "password": password.value,
                    "confirmPassword": confirmpw.value,
                });
                hideLoader2();
                alert(response.data.status);
            } else
                alert("Password and confirm password do not match");
        });
    } else if (c == "view-plans") {
        const viewPlans = document.getElementsByClassName("view-plans")[0];
        async function helper() {
            showLoader2();
            const response = await axios.get("/api/plans/plansWithID");
            hideLoader2();
            if (response.data.status) {
                for (var i = 0; i < response.data.data.length; i++) {
                    const plan = response.data.data[i];
                    const p = document.createElement("div");
                    p.classList.add("plan");
                    for (var x in plan) {
                        if (x == "__v" || x == "_proto_")
                            continue;
                        const para = document.createElement("p");
                        para.textContent = `${x} : ${plan[x]}`;
                        p.appendChild(para);
                    }
                    viewPlans.appendChild(p);
                }
            }
        }
        if (viewPlans.childElementCount == 0)
            helper();
    } else if (c == "delete-plan") {
        const plannamedelete = document.getElementById("planIDdelete");
        const deleteForm = document.getElementsByClassName("delete-form")[0];
        deleteForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            showLoader2();
            const response = await axios.delete("/api/plans/" + plannamedelete.value);
            hideLoader2();
            alert(response.data.status);
        });
    } else if (c == "update-plan") {
        const updateForm = document.getElementsByClassName("update-form")[0];
        const id = document.getElementById("idupdate");
        const plannameupdate = document.getElementById("plannameupdate");
        const priceupdate = document.getElementById("priceupdate");
        const ratingupdate = document.getElementById("ratingupdate");
        const featuresupdate = document.getElementById("features-listupdate");
        const durationupdate = document.getElementById("durationupdate");
        const discountupdate = document.getElementById("discountupdate");
        updateForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            showLoader2();
            const response = await axios.patch("/api/plans/" + id.value, {
                name: plannameupdate.value,
                duration: durationupdate.value,
                price: priceupdate.value,
                ratingsAverage: ratingupdate.value,
                features: featuresupdate.value,
                discount: discountupdate.value,
            });
            hideLoader2();
            alert(response.data.status);
        });
    }
}

function showLoader2() {
    loader2.style.opacity = "1";
    loader2.style.visibility = "visible";
}

function hideLoader2() {
    loader2.style.opacity = "0";
    loader2.style.visibility = "hidden";
}