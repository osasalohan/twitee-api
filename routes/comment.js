const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getComments,
  addComment,
  deleteComment,
} = require("../handlers/comment");

//get comments route
router.get("/comments", getComments);

//add comment route
router.post("/comments", addComment);

//delete comment route
router.delete("/comments/:comment_id", deleteComment);

module.exports = router;
