require("rootpath")();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");
var multer = require("multer");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const newFileName = (fileName) => {
  const parts = fileName.split(".");
  const extension = parts.pop();
  const rest = parts.join(".");
  const random = Math.floor(Math.random() * 10000);
  return rest + random + "." + extension;
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/marku/Documents/GitHub/ReferenceAppClient/images");
  },
  filename: function (req, file, cb) {
    cb(null, newFileName(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("file");

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.post("/upload", (req, res) => {
  console.log("file upload started");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    return res.status(200).json("/images/" + req.file.filename);
  });
});

app.use("/accounts", require("./accounts/accounts.controller"));
app.use("/pages", require("./pages/pages.controller"));
app.use("/comments", require("./comments/comments.controller"));

// swagger docs route
app.use("/api-docs", require("_helpers/swagger"));

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
