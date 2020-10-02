const planRouter = require("express").Router();
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
        cb(null, "public/images/plans/");
    },
    filename: function (req, file, cb) {
        cb(null, `plan-${Date.now()}.jpeg`)
    }
});

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
});

let multiImageHandler = upload.fields([{
    name: "cover",
    maxCount: 1
}, {
    name: "secondary",
    maxCount: 3
}]);
const {
    createPlan,
    getAllPlans,
    getPlan,
    updatePlan,
    deletePlan,
    getAllPlansWithID,
} = require("../controller/planController");
const {
    protectRoute,
    authorised,
} = require("../controller/AuthController");
planRouter
    .route("/plansWithID")
    .get(protectRoute, authorised(["admin", "owner"]), getAllPlans);
planRouter
    .route("")
    .get(protectRoute, getAllPlans);
planRouter
    .route("/createPlan")
    .post(multiImageHandler, protectRoute, authorised(["admin", "owner"]), createPlan);

planRouter
    .route("/:id")
    .get(getPlan)
    .patch(protectRoute, authorised(["admin", "owner"]), updatePlan)
    .delete(protectRoute, authorised(["admin", "owner"]), deletePlan);
module.exports = planRouter;