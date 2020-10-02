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
        console.log("PlanDB connected");
    })
    .catch(function (err) {
        console.log(err);
    });

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: [100, "Your plan length is more than 40 characters"],
    },
    duration: {
        type: Number,
        required: [true, "You Need to provide duration"]
    },
    price: {
        type: Number,
        required: true,
    },
    ratingsAverage: {
        type: Number,
    },
    features: [{
        type: String,
        required: true,
    }],
    discount: {
        type: Number,
        validate: {
            validator: function () {
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price",
        },
    },
    cover: {
        type: String,
        required: true,
        default: "",
    },
    secondaryImages: [{
        type: String,
        required: true,
        default: "",
    }],
});

const newPlanModel = mongoose.model("newPlanModel", planSchema);

module.exports = newPlanModel;