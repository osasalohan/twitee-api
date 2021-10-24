const express = require("express");
const router = express.Router({ mergeParams: true });
const { like } = require("../handlers/like");

router.put("/like", like);

module.exports = router;
