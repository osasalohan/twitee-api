const express = require("express");
const router = express.Router({ mergeParams: true });
const { getPosts, getPost, addPost, deletePost } = require("../handlers/post");

//get posts route
router.get("/posts", getPosts);

//get post route
router.get("/posts/:post_id", getPost);

//add post route
router.post("/posts", addPost);

//delete post route
router.delete("/posts/:post_id", deletePost);

module.exports = router;
