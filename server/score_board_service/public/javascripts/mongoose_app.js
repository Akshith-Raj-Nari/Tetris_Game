const connection = require("./connection").connection;
const ScoreBoardModel = require("./model").ScoreBoardModel;

var createConnection = async function () {
  try {
    await connection();
    console.log("Database connection established successfully.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

var fetchScores = async function () {
  try {
    await createConnection();
    const docs = await ScoreBoardModel.find().sort({ score: -1 }).limit(10);
    console.log("Scores fetched successfully:", docs);
  } catch (err) {
    console.error("Error fetching scores:", err);
  }
};

var addScore = async function (name, score) {
  try {
    await createConnection();
    const newScore = new ScoreBoardModel({ _id: name, score: score });
    await newScore.save();
    console.log("Score added successfully:", newScore);
  } catch (err) {
    console.error("Error adding score:", err);
  }
};

// Example usage
(async () => {
  await fetchScores();
  await addScore("John Doe", 100);
  await fetchScores();
})().catch((err) => {
  console.error("Error in example usage:", err);
});
