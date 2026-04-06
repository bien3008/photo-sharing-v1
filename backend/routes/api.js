const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user/list", userController.getUserList);
router.get("/user/:id", userController.getUserById);

router.get("/photosOfUser/:id", userController.getPhotosByUserId);

router.get("/schema", userController.getSchema);

router.get("/health", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

module.exports = router;
