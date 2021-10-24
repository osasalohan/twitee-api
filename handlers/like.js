const db = require("../models");

//Likes a post if not already liked by user else unlike
exports.like = async (req, res, next) => {
  try {
    let post = await db.Post.findById(req.params.post_id);
    let alreadyLiked = await db.Like.findOne({user: req.params.id, post: req.params.post_id});
    if (alreadyLiked) {
      await alreadyLiked.remove();
      res.status(200).json({ message: "unliked" });
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
      res.status(200).json({ message: "liked!" });
    }
  } catch (err) {
    next(err);
  }
};
