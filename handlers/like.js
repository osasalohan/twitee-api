const db = require("../models");

//gets all comments for a post
exports.getLikes = async (req, res, next) => {
  try {
    let post = await await db.Post.findById(req.params.post_id);
    return res.status(200).json(post.likeCount);
  } catch (err) {
    return next(err);
  }
};

//Likes a post and adds like to post and user instance
exports.addLike = async (req, res, next) => {
  try {
    let post = await db.Post.findById(req.params.post_id).populate("likes");
    let alreadyLiked = post.likes.some((like) => like.user == req.params.id);
    if (alreadyLiked) {
      return res.status(200).json({ message: "post already liked" });
    } else {
      let like = await db.Like.create({
        user: req.params.id,
        post: req.params.post_id,
      });
      let user = await db.User.findById(req.params.id);
      user.likes.push(like.id);
      post.likes.push(like.id);
      post.likeCount++;
      await user.save();
      await post.save();
      return res.status(200).json({ message: "liked!" });
    }
  } catch (err) {
    return next(err);
  }
};

//removes like
exports.deleteLike = async (req, res, next) => {
  try {
    let like = await db.Like.findById(req.params.like_id);
    await like.remove()
    return res.status(200).json({ message: "unliked!" });
  } catch (err) {
    return next(err);
  }
};
