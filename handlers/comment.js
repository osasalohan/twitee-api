const db = require("../models");

//gets all comments for a post
exports.getComments = async (req, res, next) => {
  try {
    let post = await (await db.Post.findById(req.params.post_id)).populate(
      "comments"
    );
    return res.status(200).json(post.comments);
  } catch (err) {
    return next(err);
  }
};

//creates comment and adds it to a post and user instance
exports.addComment = async (req, res, next) => {
  try {
    let comment = await db.Comment.create({
      text: req.body.text,
      user: req.params.id,
      post: req.params.post_id,
    });
    let user = await db.User.findById(req.params.id);
    let post = await db.Post.findById(req.params.post_id);
    user.comments.push(comment.id);
    post.comments.push(comment.id);
    await user.save();
    await post.save();
    let foundComment = await db.Comment.findById(comment.id);
    return res.status(200).json(foundComment);
  } catch (err) {
    return next(err);
  }
};

//deletes comment and refreshes page
exports.deleteComment = async (req, res, next) => {
  try {
    let comment = await db.Comment.findById(req.params.comment_id);
    await comment.remove();
    return res.status(200).json({ message: "comment deleted" });
  } catch (err) {
    return next(err);
  }
};
