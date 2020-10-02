const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./router/userRouter");
const planRouter = require("./router/planRouter");
const viewRouter = require("./router/viewRouter");
const reviewRouter = require("./router/reviewRouter");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "Views"));

app.use("/api/plans", planRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/", viewRouter);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log("Server has started at port : " + PORT);
});