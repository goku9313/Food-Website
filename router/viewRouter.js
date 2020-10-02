const viewRouter = require("express").Router();
const {
    getTrialPage,
    getHomePage,
    getPlansPage,
    loginPage,
    signPage,
    logout,
    forgetPassword,
    resetSuccessful,
    pageNotFound,
    updatePassword,
    passUpdated,
    profilePage,
    cartPage,
    likedItems,
} = require("../controller/viewController");
const {
    verifyResetToken,
    isLoggedIn,
    redirecttologin,
    populateWithWishList,
    populateWithCartList,
} = require("../controller/AuthController");
viewRouter.use(isLoggedIn);
viewRouter
    .route("/cart")
    .get(populateWithCartList, cartPage);
viewRouter
    .route("/likedItems")
    .get(populateWithWishList, likedItems);
viewRouter
    .route("/profile")
    .get(redirecttologin, profilePage);
viewRouter
    .route("/passUpdated")
    .get(passUpdated);
viewRouter
    .route("/resetPassword/:token")
    .get(verifyResetToken, updatePassword);
viewRouter
    .route("/pageNotFound")
    .get(pageNotFound);
viewRouter
    .route("/resetSuccessful")
    .get(resetSuccessful);
viewRouter
    .route("/trial")
    .get(getTrialPage);
viewRouter
    .route("/")
    .get(getHomePage);
viewRouter
    .route("/plans")
    .get(getPlansPage);
viewRouter
    .route("/login")
    .get(loginPage);
viewRouter
    .route("/signup")
    .get(signPage);
viewRouter
    .route("/logout")
    .get(logout);
viewRouter
    .route("/forgetPassword")
    .get(forgetPassword);
module.exports = viewRouter;