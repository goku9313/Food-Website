const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK || require("../Config/secrets").DB_LINK;
// connection
mongoose
    .connect(
        DB_LINK, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
    )
    .then(function (db) {
        console.log("UserDB connected");
    })
    .catch(function (err) {
        console.log(err);
    });
// Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 7,
        required: true,
        select: false,
    },
    confirmPassword: {
        type: String,
        minlength: 7,
        required: true,
        validate: function () {
            return this.password == this.confirmPassword;
        },
    },
    role: {
        type: String,
        enum: ["admin", "user", "owner", "delivery Boy"],
        default: "user",
    },
    resetToken: String,
    resetTokenExpiration: Date,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: "/images/users/default.png"
    },
    liked: [{
        type: mongoose.Schema.ObjectId,
        ref: "newPlanModel",
    }],
    cart: [{
        plan: {
            type: mongoose.Schema.ObjectId,
            ref: "newPlanModel",
        },
        quantity: {
            type: Number,
        },
    }],
});

// hooks 
userSchema.pre("save", function () {
    // db => confirmpassword
    this.confirmPassword = undefined;
});
//methods
userSchema.methods.createResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetToken = token;
    // The token will be valid upto 10 mins from time of receiving
    this.resetTokenExpiration = Date.now() + 1000 * 60 * 10;
    return token;
};
userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
    this.resetTokenExpiration = undefined;
}
userSchema.methods.emailVerificationCreator = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetToken = token;
    return token;
};
userSchema.methods.emailVerificationHandler = function () {
    this.resetToken = undefined;
    this.emailVerified = true;
}
const userModel = mongoose.model("NewUserModel", userSchema);

module.exports = userModel;