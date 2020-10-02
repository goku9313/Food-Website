const userModel = require("../model/userModel");
const planModel = require("../model/planModel");
const sharp = require("sharp");
const fs = require("fs");
module.exports.createUser = async function createUser(req, res) {
    try {
        const user = req.body;
        let createdPlan = await userModel.create(user);
        res.status(201).json({
            status: "User created",
            data: user
        });
    } catch (err) {
        res.status(501).json({
            err,
            status: "Internal server error",
        });
    }
};
module.exports.getAllUser = async function getAllUser(req, res) {
    try {
        const users = await userModel.find({});
        res.status(200).json({
            status: "all users recieved",
            data: users
        });
    } catch (err) {
        res.status(404).json({
            status: "Failed to receive users",
            err,
        });
    }

};
module.exports.getUser = async function getUser(req, res) {
    try {
        const id = req.body.id || req.params.id;
        console.log(req.body);
        const user = await userModel.findById(id);
        res.status(200).json({
            status: "Successful",
            data: user,
        });
    } catch (err) {
        res.status(404).json({
            status: "User not found",
            err,
        });
    }
};
module.exports.updateUser = async function updateUser(req, res) {
    try {
        const id = req.body.id;
        const userUpdate = req.body;
        const originalUser = await userModel.findById(id).select("+password");
        for (var key in userUpdate) {
            if (key == "token" || key == "id")
                continue;
            originalUser[key] = userUpdate[key];
        }
        originalUser.confirmPassword = originalUser.password;
        await originalUser.save();
        res.status(200).json({
            status: "User updated successfully",
            data: originalUser,
        });
    } catch (err) {
        res.status(202).json({
            status: "Invalid information provided",
            err,
        });
    }
};
module.exports.deleteUser = async function deleteUser(req, res) {
    try {
        const id = req.params.id || req.body.id;
        const removedUser = await userModel.findByIdAndRemove(id);
        res.status(200).json({
            status: "User successfully removed.",
            data: removedUser,
        });
    } catch (err) {
        res.status(404).json({
            status: "User not found",
            err,
        });
    }
};
module.exports.updatePassword = async function updatePassword(req, res) {
    try {
        const {
            id,
            password,
            confirmPassword
        } = req.body;
        const user = await userModel.findById(id);
        if (user) {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.status(200).json({
                status: "Password updated",
            });
        } else {
            throw new Error("Unable to reset password");
        }
    } catch (err) {
        res.status(202).json({
            status: "Unable to update",
            err,
        })
    }
}
module.exports.changePhoto = async function changePhoto(req, res) {
    try {
        const id = req.body.id;
        const user = await userModel.findById(id);
        if (user) {
            var list = __dirname.split("\\");
            list.pop();
            let serverPath1 = `${list.join("/")}/public`;
            let serverPath2 = `/images/users/user-${Date.now()}.jpeg`;
            await sharp(req.file.path)
                .resize({
                    width: 135
                })
                .toFormat("jpeg")
                .jpeg({
                    quality: 90
                })
                .toFile(serverPath1 + serverPath2);
            fs.unlinkSync(req.file.path);
            if (user.profileImage != "/images/users/default.png") {
                fs.unlinkSync(`public/${user.profileImage}`);
            }
            user.profileImage = serverPath2;
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: true,
            })
        } else
            throw new Error("ID not found");
    } catch (err) {
        console.log(err.message);
        res.status(202).json({
            status: "Failed to update photo",
            err,
        });
    }
};
module.exports.updateLiked = async function updateLiked(req, res) {
    try {
        const user = await userModel.findById(req.body.id);
        const plan = await planModel.findById(req.body.planId);
        if (plan && user) {
            const likedList = user.liked;
            var isPresent = false;
            for (var i = 0; i < likedList.length; i++) {
                if (likedList[i] == req.body.planId) {
                    likedList.splice(i, 1);
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                likedList.push(req.body.planId);
            }
            user.liked = likedList;
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: true,
            });
        } else
            throw new Error("Unable to find given plan");
    } catch (err) {
        console.log(err);
        res.status(202).json({
            status: false,
            err,
        });
    }
};
module.exports.addToCart = async function addToCart(req, res) {
    try {
        const user = await userModel.findById(req.body.id);
        const plan = await planModel.findById(req.body.planId);
        if (plan && user) {
            const cartList = user.cart;
            var isPresent = false;
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].plan == req.body.planId) {
                    cartList[i].quantity += 1;
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                var obj = {
                    plan: req.body.planId,
                    quantity: 1,
                };
                cartList.push(obj);
            }
            user.cart = cartList;
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: true,
            });
        } else
            throw new Error("Unable to find given plan");
    } catch (err) {
        console.log(err);
        res.status(202).json({
            status: false,
            err,
        });
    }
};
module.exports.removeFromCart = async function removeFromCart(req, res) {
    try {
        const user = await userModel.findById(req.body.id);
        const plan = await planModel.findById(req.body.planId);
        if (plan && user) {
            const cartList = user.cart;
            var quantity = 0;
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].plan == req.body.planId) {
                    quantity = cartList[i].quantity;
                    cartList.splice(i, 1);
                    break;
                }
            }
            user.cart = cartList;
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: true,
                quantity,
            });
        } else
            throw new Error("Unable to find given plan");
    } catch (err) {
        console.log(err);
        res.status(202).json({
            status: false,
            err,
        });
    }
};
module.exports.decreaseQuantity = async function (req, res) {
    try {
        const user = await userModel.findById(req.body.id);
        const plan = await planModel.findById(req.body.planId);
        if (plan && user) {
            const cartList = user.cart;
            var isPresent = false;
            var remove = false;
            var quantity = 0;
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].plan == req.body.planId) {
                    cartList[i].quantity -= 1;
                    quantity = cartList[i].quantity;
                    if (cartList[i].quantity == 0) {
                        remove = true;
                        cartList.splice(i, 1);
                    }
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                throw new Error("Unable to find given plan");
            }
            user.cart = cartList;
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: true,
                remove,
                quantity,
            });
        } else
            throw new Error("Unable to find given plan");
    } catch (err) {
        console.log(err);
        res.status(202).json({
            status: false,
            err,
        });
    }
}
module.exports.increaseQuantity = async function (req, res) {
    try {
        const user = await userModel.findById(req.body.id);
        const plan = await planModel.findById(req.body.planId);
        if (plan && user) {
            const cartList = user.cart;
            var isPresent = false;
            var quantity = 0;
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].plan == req.body.planId) {
                    cartList[i].quantity += 1;
                    quantity = cartList[i].quantity;
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                throw new Error("Unable to find given plan");
            }
            user.cart = cartList;
            await user.save({
                validateBeforeSave: false
            });
            res.status(200).json({
                status: true,
                quantity,
            });
        } else
            throw new Error("Unable to find given plan");
    } catch (err) {
        console.log(err);
        res.status(202).json({
            status: false,
            err,
        });
    }
}