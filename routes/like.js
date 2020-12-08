const express = require("express");
const router = express.Router({ mergeParams: true });
const { getLikes, addLike, deleteLike } = require("../handlers/Like");

//get likes route
router.get("/likes", getLikes);

//add Like route
router.post("/likes", addLike);

//delete Like route
router.delete("/likes/:like_id", deleteLike);

module.exports = router;
