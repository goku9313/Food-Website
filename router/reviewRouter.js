const reviewRouter = require("express").Router();
const {
    getAllReviews,
    createReview,
} = require("../controller/reviewController");
reviewRouter
    .route("/")
    .get(getAllReviews);
reviewRouter
    .route("/createReview")
    .post(createReview);
module.exports = reviewRouter;