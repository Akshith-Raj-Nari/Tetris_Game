const connection = require("../public/javascripts/connection").connection;
const ScoreBoardModel = require("../public/javascripts/model").ScoreBoardModel;
const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    await connection();
    const docs = await ScoreBoardModel.find().sort({ score: -1 }).limit(10);
    if (docs.length > 0) {
      res.status(200).json({
        status: true,
        message: "Fetching successful",
        data: docs,
      });
    } else {
      res.status(404).json({
        status: false,
        message: "No scores found",
        data: [],
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
