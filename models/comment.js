const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//removes comment from user and post instances before deleting
commentSchema.pre("remove", async function (next) {
  try {
    let user = await User.findById(this.user);
    let post = await Post.findById(this.post);
    user.comments.remove(this.id);
    post.comments.remove(this.id);
    await user.save();
    await post.save();
    next();
  } catch (err) {
    return next(err);
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
