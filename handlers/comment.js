const db = require("../models");
const Joi = require("joi");

const addCommentSchema = Joi.object({
  text: Joi.string().required(),
});

//gets all comments for a post
exports.getComments = async (req, res, next) => {
  try {
    let comments = await db.Comment.find({ post: req.params.post_id }).populate(
      "user",
      "name email"
    );
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

//creates comment and adds it to a post and user instance
exports.addComment = async (req, res, next) => {
  try {
    await addCommentSchema.validateAsync(req.body);

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
    res.status(200).json(foundComment);
  } catch (err) {
    next(err);
  }
};

//deletes comment and refreshes page
exports.deleteComment = async (req, res, next) => {
  try {
    let commentExists = await db.Comment.exists({ _id: req.params.comment_id });
    if (!commentExists) throw new Error("Comment not found");

    let comment = await db.Comment.findOne({
      _id: req.params.comment_id,
      user: req.params.id,
    });
    if (!comment)
      throw new Error("You cannot delete a comment you did not create");

    await comment.remove();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};
