const userRouter = require("express").Router();
const multer = require("multer");
const filter = function (req, file, cb) {
	if (file.mimetype.startsWith("image")) {
		cb(null, true)
	} else {
		cb(new Error("Not an Image! Please upload an image"), false)
	}
};

const multerStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/images/users/");
	},
	filename: function (req, file, cb) {
		cb(null, `user-${Date.now()}.jpeg`)
	}
});

const upload = multer({
	storage: multerStorage,
	fileFilter: filter
});

const {
	signup,
	login,
	protectRoute,
	authorised,
	forgetPassword,
	resetPassword,
	verifyEmail,
} = require("../controller/AuthController");
const {
	createUser,
	getAllUser,
	getUser,
	updateUser,
	deleteUser,
	updatePassword,
	changePhoto,
	updateLiked,
	addToCart,
	removeFromCart,
	increaseQuantity,
	decreaseQuantity,
} = require("../controller/userController");

// userRouter
// 	.route("")
// 	.get(getAllUser)
// 	.post(createUser);
userRouter
	.route("/increaseQuantity")
	.patch(protectRoute, increaseQuantity);
userRouter
	.route("/decreaseQuantity")
	.patch(protectRoute, decreaseQuantity);
userRouter
	.route("/removeFromCart")
	.patch(protectRoute, removeFromCart);
userRouter
	.route("/addToCart")
	.patch(protectRoute, addToCart);
userRouter
	.route("/updateLiked")
	.patch(protectRoute, updateLiked);
userRouter
	.route("/changePhoto")
	.patch(upload.single("photo"), protectRoute, changePhoto);
userRouter
	.route("/updatePassword/:token")
	.patch(resetPassword);
userRouter
	.route("/emailVerification/:token")
	.patch(verifyEmail);
userRouter
	.route("/forgetPassword")
	.patch(forgetPassword);
userRouter
	.route("")
	.get(protectRoute, authorised(["admin"]), getAllUser);
// userRouter
// 	.route("/:id")
// 	.get(getUser)
// 	.patch(protectRoute, authorised(["admin"]), updateUser)
// 	.delete(protectRoute, authorised(["admin"]), deleteUser);
userRouter
	.route("/signup")
	.post(signup);
userRouter
	.route("/login")
	.post(login);
userRouter
	.route("/getMe")
	.get(protectRoute, getUser);
userRouter
	.route("/deleteMe")
	.delete(protectRoute, deleteUser);
userRouter
	.route("/updateMe")
	.patch(protectRoute, updateUser);
userRouter
	.route("/changePassword")
	.patch(protectRoute, updatePassword);

module.exports = userRouter;