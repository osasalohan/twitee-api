const db = require("../models");

//gets and returns all posts in the database
exports.getPosts = async function (req, res, next) {
  try {
    let posts = await db.Post.find({});
    return res.status(200).json(posts);
  } catch (err) {
    return next(err);
  }
};

//creates a post in database that belongs to a user and returns it
exports.addPost = async function (req, res, next) {
  try {
    let post = await db.Post.create({
      text: req.body.text,
      user: req.params.id,
    });
    let user = await db.User.findById(req.params.id);
    user.posts.push(post.id);
    await user.save();
    let foundPost = await db.Post.findById(post.id);
    return res.status(200).json(foundPost);
  } catch (err) {
    return next(err);
  }
};

//deletes a post from database
exports.deletePost = async function (req, res, next) {
  try {
    let post = await db.Post.findById(req.params.post_id);
    await post.remove();
    return res.status(200).json({ message: "post deleted" });
  } catch (err) {
    return next(err);
  }
};
