const planModel = require("../model/planModel");
const sharp = require("sharp");
const fs = require("fs");
module.exports.createPlan = async function createPlan(req, res) {
	try {
		var list = __dirname.split("\\");
		list.pop();
		let serverPath1 = `${list.join("/")}/public`;
		let serverPathCover = `/images/plans/cover-${Date.now()}.jpeg`;
		// cover
		await sharp(req.files.cover[0].path)
			.resize({
				width: 1000
			}).toFormat("jpeg").jpeg({
				quality: 90
			}).toFile(serverPath1 + serverPathCover);
		fs.unlinkSync(req.files.cover[0].path);
		let promiseArr = [];
		var pathArray = [];
		// Secondary
		for (let i = 0; i < req.files.secondary.length; i++) {
			let serverPathSecondary = `/images/plans/secondary-${Date.now()}${i}.jpeg`;
			let filePromise = sharp(req.files.secondary[i].path)
				.resize({
					width: 1000
				})
				.toFormat("jpeg")
				.jpeg({
					quality: 90
				}).toFile(serverPath1 + serverPathSecondary);
			pathArray.push(serverPathSecondary);
			promiseArr.push(filePromise);
		}
		await Promise.all(promiseArr);
		// Promise.all waits for all the promises to be finished in the given list
		for (var i = 0; i < req.files.secondary.length; i++) {
			fs.unlinkSync(req.files.secondary[i].path);
		}
		const plan = {
			name: req.body.name,
			duration: parseInt(req.body.duration),
			price: parseInt(req.body.price),
			ratingsAverage: parseInt(req.body.ratingsAverage),
			features: req.body.features.split("/"),
			discount: parseInt(req.body.discount),
			cover: serverPathCover,
			secondaryImages: pathArray,
		}
		await planModel.create(plan);
		res.status(201).json({
			status: "Plan created",
		});

	} catch (err) {
		console.log(err);
		res.status(202).json({
			err,
			status: "Unable to create plan, try again later.",
		});
	}
};
module.exports.getAllPlans = async function getAllplans(req, res) {
	try {
		const plans = await planModel.find({});
		res.status(200).json({
			status: true,
			data: plans
		});
	} catch (err) {
		res.status(404).json({
			status: "Failed to receive plans",
			err,
		});
	}
};
module.exports.getPlan = async function getPlan(req, res) {
	try {
		const {
			id
		} = req.params;
		const plan = await planModel.findById(id);
		res.status(200).json({
			status: "successful",
			data: plan,
		});
	} catch (err) {
		res.status(404).json({
			status: "Plan not found",
			err,
		});
	}
};
module.exports.updatePlan = async function updatePlan(req, res) {
	try {
		const id = req.params.id;
		delete req.body.id;
		const planUpdate = req.body;
		const originalPlan = await planModel.findById(id);
		for (var key in planUpdate) {
			originalPlan[key] = planUpdate[key];
		}
		await originalPlan.save();
		res.status(200).json({
			status: "Plan updated successfully",
			data: originalPlan,
		});
	} catch (err) {
		res.status(202).json({
			status: "Plan not found",
			err,
		});
	}
};
module.exports.deletePlan = async function deletePlan(req, res) {
	try {
		const id = req.params.id;
		const removedPlan = await planModel.findByIdAndRemove(id);
		res.status(200).json({
			status: "Plan successfully removed.",
			data: removedPlan,
		});
	} catch (err) {
		res.status(202).json({
			status: "Plan not found",
			err,
		});
	}
};