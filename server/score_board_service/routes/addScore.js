const connection = require("../public/javascripts/connection").connection;
const ScoreBoardModel = require("../public/javascripts/model").ScoreBoardModel;
const express = require("express");
const router = express.Router();

router.post("/", async function (req, res) {
  try {
    await connection();
    const { name, score } = req.body;
    if (!name || !score) {
      return res.status(400).json({
        status: false,
        message: "Name and score are required fields.",
      });
    } else {
      const newScore = new ScoreBoardModel({ _id: name, score: score });
      await newScore.save();
      res.status(201).json({
        status: true,
        message: "Score added successfully",
        data: newScore,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
});
