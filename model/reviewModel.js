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
        console.log("ReviewDB connected");
    })
    .catch(function (err) {
        console.log(err);
    });
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "newPlanModel",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "NewUserModel",
        required: true,
    }
});
const reviewModel = mongoose.model("NewReviewModel", reviewSchema);

module.exports = reviewModel;