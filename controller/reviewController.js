const reviewModel = require("../model/reviewModel");
module.exports.getAllReviews = async function (req, res) {
    try {
        const reviews = await reviewModel.find().populate("user").populate("plan");
        res.status(201).json({
            reviews,
        });
    } catch (err) {
        res.status(200).json({
            err: err.message,
        });
    }
};
module.exports.createReview = async function (req, res) {
    try {
        const review = await reviewModel.create(req.body);
        res.status(201).json({
            review,
        });
    } catch (err) {
        res.status(200).json({
            err: err.message,
        });
    }
};