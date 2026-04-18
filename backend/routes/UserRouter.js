const express = require("express");
const User = require("../db/userModel");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", async (request, response) => {
	response.status(501).send({ message: "Not implemented" });
});

// GET /api/user/list
router.get("/list", async (request, response) => {
	try {
		const users = await User.find({}, "first_name last_name").exec();
		response.json(users);
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