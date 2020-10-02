const userModel = require("../model/userModel");
const planModel = require("../model/planModel");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || require("../Config/secrets").JWT_SECRET;
const user = process.env.USER || require("../Config/secrets").USER;
const pass = process.env.PASS || require("../Config/secrets").PASS;
const nodemailer = require("nodemailer");

module.exports.signup = async function (req, res) {
    try {
        const user = await userModel.create(req.body);
        if (user) {
            const verifyToken = user.emailVerificationCreator();
            await user.save({
                validateBeforeSave: false
            });
            var verifyPath = "http://localhost:3000/api/users/emailVerification/" + verifyToken;
            // email configuration=> from mailtrap.io
            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: user,
                    pass: pass
                }
            });
            // email options
            const emailOptions = {
                from: "mayanktyagi3111@gmail.com",
                to: user.email,
                subject: "Email verification for food website.",
                text: "Email verification",
                html: `<h3>Hello, click this link for verifying your email : ${verifyPath}</h3>`,
            }
            const id = user["_id"];
            const token = jwt.sign({
                id
            }, JWT_SECRET);
            res.cookie("jwt", token, {
                httpOnly: true
            });
            // send mail
            await transport.sendMail(emailOptions);
            res.status(201).json({
                status: "User created and email verification sent to user's email address.",
                user,
            });
        } else
            throw new Error("Invalid info received.");
    } catch (err) {
        res.status(202).json({
            status: "Internal server error",
            err,
        });
    }
};
module.exports.login = async function (req, res) {
    try {
        if (req.body.email && req.body.password) {
            const user = await userModel
                .findOne({
                    email: req.body.email
                })
                .select("+password");
            if (user) {
                if (user.password == req.body.password) {
                    // Using user ID as Payload
                    const id = user["_id"];
                    const token = jwt.sign({
                        id
                    }, JWT_SECRET);
                    res.cookie("jwt", token, {
                        httpOnly: true
                    });
                    res.status(200).json({
                        status: "User logged in",
                        user,
                    });
                } else
                    throw new Error("Invalid e-mail or password");
            } else {
                throw new Error("Invalid e-mail or password");
            }
        } else
            throw new Error("Invalid e-mail or password");
    } catch (err) {
        res.status(202).json({
            status: "Cannot login",
            err,
        });
    }
};
module.exports.protectRoute = function (req, res, next) {
    try {
        const userToken = req.cookies.jwt;
        const payload = jwt.verify(userToken, JWT_SECRET);
        if (payload) {
            req.body["id"] = payload["id"];
            next();
        } else
            throw new Error("Modified token, please login again.");
    } catch (err) {
        res.status(202).json({
            status: false,
            err,
        });
    }
};
module.exports.authorised = function (roles) {
    return async function (req, res, next) {
        try {
            const id = req.body.id;
            const user = await userModel.findById(id);
            if (roles.includes(user.role) == true) {
                next();
            } else {
                throw new Error("Not authorised");
            }
        } catch (err) {
            res.status(401).json({
                status: "Operation not allowed",
                err,
            });
        }
    }
};
module.exports.forgetPassword = async function (req, res) {
    try {
        var email = req.body.email;
        const user = await userModel.findOne({
            email: email
        });
        if (user) {
            const resetToken = user.createResetToken();
            await user.save({
                validateBeforeSave: false
            });
            var resetPath = "http://localhost:3000/resetPassword/" + resetToken;
            // email configuration=> from mailtrap.io
            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: user,
                    pass: pass
                }
            });
            // email options
            const emailOptions = {
                from: "mayanktyagi3111@gmail.com",
                to: user.email,
                subject: "Password reset email",
                text: "Password reseting email",
                html: `<h3>Hello, click this link for reseting your password : <a href="${resetPath}">Reset Link</a></h3>`,
            }
            // send mail
            await transport.sendMail(emailOptions);
            res.status(200).json({
                status: true,

            });
        } else {
            throw new Error("User not found.");
        }
    } catch (err) {
        res.status(202).json({
            status: false,
            err,
        });
    }
};
module.exports.verifyResetToken = async function (req, res, next) {
    try {
        const token = req.params.token;
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        });
        if (user) {
            req.body.id = user["_id"];
            next();
        } else {
            throw new Error("Page not Found");
        }
    } catch (err) {
        res.redirect("/pageNotFound");
    }
}
module.exports.resetPassword = async function (req, res) {
    try {
        const token = req.params.token;
        const {
            password,
            confirmPassword
        } = req.body;
        const user = await userModel.findOne({
            resetToken: token,
        });
        if (user) {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.status(200).json({
                status: true,
            });
        } else {
            throw new Error("Unable to reset password");
        }
    } catch (err) {
        res.status(202).json({
            status: false,
            err,
        });
    }
};
module.exports.verifyEmail = async function (req, res) {
    try {
        const token = req.params.token;
        const user = await userModel.findOne({
            resetToken: token,
        });
        if (user) {
            user.emailVerificationHandler();
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: "Email verified successfully",
            });
        } else {
            throw new Error("Error 404 page not found.");
        }
    } catch (err) {
        res.status(202).json({
            status: "Some error occured",
            err,
        });
    }
};
module.exports.isLoggedIn = async function (req, res, next) {
    try {
        const userToken = req.cookies.jwt;
        const payload = jwt.verify(userToken, JWT_SECRET);
        if (payload) {
            const user = await userModel.findById(payload.id);
            req.body.name = user.name;
            req.body.user = user;
            next();
        } else {
            next();
        }
    } catch (err) {
        next();
    }
};
module.exports.redirecttologin = function (req, res, next) {
    if (req.body.user) {
        next();
    } else {
        res.redirect("/login");
    }
};
module.exports.populateWithCartList = async function (req, res, next) {
    var list = req.body.user.cart;
    var plans = [];
    for (var i = 0; i < list.length; i++) {
        const plan = await planModel.findById(list[i].plan);
        plans.push({
            plan,
            quantity: list[i].quantity,
        });
    }
    req.body.plans = plans;
    next();
};
module.exports.populateWithWishList = async function (req, res, next) {
    var list = req.body.user.liked;
    var plans = [];
    for (var i = 0; i < list.length; i++) {
        const plan = await planModel.findById(list[i]);
        plans.push(plan);
    }
    req.body.plans = plans;
    next();
};