require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const likeRoutes = require("./routes/like");
const errorHandler = require("./handlers/error");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");

const app = express();

//express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//available routes
app.use("/api", authRoutes);
app.use("/api/:id", loginRequired, ensureCorrectUser, postRoutes);
app.use(
  "/api/:id/posts/:post_id",
  loginRequired,
  ensureCorrectUser,
  commentRoutes
);
app.use(
  "/api/:id/posts/:post_id",
  loginRequired,
  ensureCorrectUser,
  likeRoutes
);

//handle errors with useful messages
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
