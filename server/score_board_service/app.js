var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

// Import routes
var fetchScoreRouter = require("./routes/fetchScore");
var addScoreRouter = require("./routes/addScore");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Enable CORS for the specified origin
// This allows the frontend to make requests to the backend
// from http://localhost:5173 with credentials (cookies, authorization headers, etc.)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Use the imported routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/fetchscore", fetchScoreRouter);
app.use("/addscore", addScoreRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render("error");
  res.status(err.status || 500).json({
    status: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
