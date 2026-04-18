const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");

router.post("/", async (request, response) => {
	response.status(501).send({ message: "Not implemented" });
});

// GET /api/user/list
router.get("/list", async (request, response) => {
	try {
		const users = await User.find({}, "first_name last_name").lean().exec();
		
		// Add photo_count and comment_count to each user
		const commentCounts = await Photo.aggregate([
			{ $unwind: "$comments" },
			{ $group: { _id: "$comments.user_id", count: { $sum: 1 } } }
		]);
		const commentCountMap = {};
		commentCounts.forEach(c => {
			commentCountMap[String(c._id)] = c.count;
		});

		const usersWithCounts = await Promise.all(users.map(async (u) => {
			const photo_count = await Photo.countDocuments({ user_id: u._id });
			return {
				...u,
				photo_count: photo_count,
				comment_count: commentCountMap[String(u._id)] || 0
			};
		}));

		response.json(usersWithCounts);
	} catch (err) {
		console.error(err);
		response.status(500).send({ message: "Server error" });
	}
});

// GET /api/user/:id
router.get("/:id", async (request, response) => {
	const id = request.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return response.status(400).send({ message: "Bad Request: invalid user id" });
	}
	try {
		const user = await User.findById(id, "first_name last_name location description occupation").exec();
		if (!user) {
			return response.status(400).send({ message: "Bad Request: user not found" });
		}
		response.json(user);
	} catch (err) {
		console.error(err);
		response.status(500).send({ message: "Server error" });
	}
});

module.exports = router;