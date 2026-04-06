const data = require("../models/data");

const getUserList = (req, res) => {
  try {
    const users = data.userListModel();
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No users found",
      });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching user list",
      message: error.message,
    });
  }
};

const getUserById = (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const user = data.userModel(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching user",
      message: error.message,
    });
  }
};

const getPhotosByUserId = (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const user = data.userModel(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const photos = data.photoOfUserModel(userId);

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching user photos",
      message: error.message,
    });
  }
};

const getSchema = (req, res) => {
  try {
    const schema = data.schemaModel();
    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching schema",
      message: error.message,
    });
  }
};

module.exports = {
  getUserList,
  getUserById,
  getPhotosByUserId,
  getSchema,
};
