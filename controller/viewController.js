const planModel = require("../model/planModel");
module.exports.getTrialPage = function (req, res) {
    res.render("index.pug", {
        title: "Sample title",
        name: req.body.name,
    });
}
module.exports.getHomePage = async function (req, res) {
    const plans = await planModel.find({});
    res.render("home.pug", {
        title: "Home Page",
        plans,
        name: req.body.name,
    });
};
module.exports.loginPage = function (req, res) {
    res.render("login.pug", {
        title: "Sign In/Sign Up Page",
        login: "login",
        name: req.body.name,
    });
};
module.exports.signPage = function (req, res) {
    res.render("login.pug", {
        title: "Sign In/Sign Up Page",
        name: req.body.name,
    });
}
module.exports.logout = function (req, res) {
    res.cookie("jwt", undefined, {
        httpOnly: true,
    });
    res.redirect("/");
};
module.exports.forgetPassword = function (req, res) {
    res.render("forgotPassword.pug", {
        title: "Forgot Password",
        name: req.body.name,
    });
}
module.exports.resetSuccessful = function (req, res) {
    res.render("resetLinkSent.pug", {
        title: "Password reset successfully!",
        name: req.body.name,
    });
}
module.exports.updatePassword = function (req, res) {
    res.render("updatePassword.pug", {
        title: "Update password",
        name: req.body.name,
    });
};
module.exports.pageNotFound = function (req, res) {
    res.render("error404.pug", {
        title: "Error 404 Page not found!",
        name: req.body.name,
    });
};
module.exports.passUpdated = function (req, res) {
    res.render("passUpdated.pug", {
        title: "Password updated Successfully!",
        name: req.body.name,
    });
};
module.exports.profilePage = function (req, res) {
    res.render("profile.pug", {
        title: req.body.name + "'s Profile page",
        user: req.body.user,
    })
};
module.exports.getPlansPage = async function (req, res) {
    const plans = await planModel.find({});
    res.render("plansPage.pug", {
        title: "Plans Page",
        plans,
        user: req.body.user,
    });
};
module.exports.likedItems = function (req, res) {
    res.render("likePage.pug", {
        title: req.body.name + "'s Liked Items Page",
        user: req.body.user,
        plans: req.body.plans,
    })
};
module.exports.cartPage = function (req, res) {
    res.render("cartPage.pug", {
        title: req.body.name + "'s Cart Page",
        user: req.body.user,
        plans: req.body.plans,
    })
};