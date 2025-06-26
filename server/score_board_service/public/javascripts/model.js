const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreBoardSchema = new Schema({
  _id: String,
  score: Number,
});

const ScoreBoardModel = mongoose.model("ScoreBoard", ScoreBoardSchema);

module.exports.ScoreBoardModel = ScoreBoardModel;
