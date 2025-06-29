const express = require("express");
const router = express.Router();
const { ScoreBoardModel } = require("../public/javascripts/model");

// Ensure DB is connected once at startup
require("../public/javascripts/connection").connection();

router.post("/", async function (req, res) {
  try {
    const { name, score } = req.body;

    // Validate fields — allow score=0
    if (!name || score === undefined || score === null) {
      return res.status(400).json({
        status: false,
        message: "Name and score are required fields.",
      });
    }

    // Try inserting a new score
    const newScore = new ScoreBoardModel({ _id: name, score });
    await newScore.save();

    res.status(201).json({
      status: true,
      message: "Score added successfully",
      data: newScore,
    });
  } catch (err) {
    // Handle duplicate key (same name already exists)
    if (err.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "Name already exists. Please choose another name.",
      });
    }

    // Handle all other errors
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;
