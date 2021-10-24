const db = require("../models");
const Joi = require("joi");

//validate add post request body
const addPostSchema = Joi.object({
  text: Joi.string().required(),
});

//gets and returns all posts in the database
exports.getPosts = async function (req, res, next) {
  try {
    let posts = await db.Post.find({})
      .populate("user", "name email")
      .populate({
        path: "comments",
        populate: { path: "user", model: "User" },
      });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

//creates a post in database that belongs to a user and returns it
exports.addPost = async function (req, res, next) {
  try {
    await addPostSchema.validateAsync(req.body);

    let post = await db.Post.create({
      text: req.body.text,
      user: req.params.id,
    });
    let user = await db.User.findById(req.params.id);
    user.posts.push(post.id);
    await user.save();
    let foundPost = await db.Post.findById(post.id)
      .populate("user", "name email")
      .populate({
        path: "comments",
        populate: { path: "user", model: "User" },
      });
    res.status(200).json(foundPost);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

//deletes a post from database
exports.deletePost = async function (req, res, next) {
  try {
    let postExists = await db.Post.exists({ _id: req.params.post_id });
    if (!postExists) throw new Error("Post not found");

    let post = await db.Post.findOne({
      _id: req.params.post_id,
      user: req.params.id,
    });
    if (!post) throw new Error("You cannot delete a post you did not create");

    await post.remove();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};
