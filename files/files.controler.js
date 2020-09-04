const config = require("config.json");
const express = require("express");
const router = express.Router();
var multer = require("multer");

router.post("/", uploadFile);

module.exports = router;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.imageStoragePath);
  },
  filename: function (req, file, cb) {
    cb(null, newFileName(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("file");

function uploadFile(req, res) {
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
}

// helper methods

function newFileName(fileName) {
  const parts = fileName.split(".");
  const extension = parts.pop();
  const rest = parts.join(".");
  const random = Math.floor(Math.random() * 10000);
  return rest + random + "." + extension;
}
