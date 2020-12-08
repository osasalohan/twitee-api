const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const likeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//removes like from user and post instances and reduces like count before deleting
likeSchema.pre("remove", async function (next) {
  try {
    let user = await User.findById(this.user);
    let post = await Post.findById(this.post);
    user.likes.remove(this.id);
    post.likes.remove(this.id);
    post.likeCount--;
    await user.save();
    await post.save();
    console.log("you are definitely hitting the pre remove hook");
    next();
  } catch (err) {
    return next(err);
  }
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
