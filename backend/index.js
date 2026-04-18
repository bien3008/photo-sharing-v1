const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const Photo = require("./db/photoModel");
const User = require("./db/userModel");
const mongoose = require("mongoose");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

// GET /api/photosOfUser/:id
app.get("/api/photosOfUser/:id", async (request, response) => {
  const id = request.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send({ message: "Bad Request: invalid user id" });
  }
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return response.status(400).send({ message: "Bad Request: user not found" });
    }

    const photos = await Photo.find({ user_id: id }).exec();

    // gather unique user_ids from comments
    const commentUserIds = new Set();
    photos.forEach((p) => {
      if (Array.isArray(p.comments)) {
        p.comments.forEach((c) => {
          if (c.user_id) commentUserIds.add(String(c.user_id));
        });
      }
    });

    const usersMap = {};
    if (commentUserIds.size > 0) {
      const ids = Array.from(commentUserIds);
      const users = await User.find({ _id: { $in: ids } }, "first_name last_name").exec();
      users.forEach((u) => {
        usersMap[String(u._id)] = u;
      });
    }

    const result = photos.map((p) => {
      return {
        _id: p._id,
        user_id: p.user_id,
        file_name: p.file_name,
        date_time: p.date_time,
        comments: (p.comments || []).map((c) => ({
          _id: c._id,
          comment: c.comment,
          date_time: c.date_time,
          user: usersMap[String(c.user_id)] || { _id: c.user_id, first_name: "", last_name: "" },
        })),
      };
    });

    response.json(result);
  } catch (err) {
    console.error(err);
    response.status(500).send({ message: "Server error" });
  }
});

// GET /api/commentsOfUser/:id
app.get("/api/commentsOfUser/:id", async (request, response) => {
  const id = request.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).send({ message: "Bad Request: invalid user id" });
  }
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return response.status(400).send({ message: "Bad Request: user not found" });
    }

    // Find all photos that contain at least one comment by this user
    const photos = await Photo.find({ "comments.user_id": id }).exec();

    const result = [];
    photos.forEach((p) => {
      p.comments.forEach((c) => {
        if (String(c.user_id) === String(id)) {
          result.push({
            _id: c._id,
            comment: c.comment,
            date_time: c.date_time,
            photo: {
              _id: p._id,
              user_id: p.user_id,
              file_name: p.file_name,
            },
          });
        }
      });
    });

    response.json(result);
  } catch (err) {
    console.error(err);
    response.status(500).send({ message: "Server error" });
  }
});

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
