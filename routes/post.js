const express = require("express");
const router = express.Router({ mergeParams: true });
const { getPosts, addPost, deletePost } = require("../handlers/post");

//get posts route
router.get("/posts", getPosts);

//add post route
router.post("/posts", addPost);

//delete post route
router.delete("/posts/:post_id", deletePost);

module.exports = router;
