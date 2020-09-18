const express = require("express");
const router = express.Router();
const db = require("_helpers/db");
const fileService = require("./file.service");
const authorize = require("../_middleware/authorize");
const Role = require("../_helpers/role");
var multer = require("multer");

const upload = multer({ storage: fileService.storage });

router.get("/", getAll);
router.get("/:filename", getByFilename);
router.get("/images/:filename", getImage);
router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:id", authorize(Role.Admin), _delete);

module.exports = router;

function getAll(req, res, next) {
  console.log("get All files");
  fileService
    .getAll()
    .then((files) => res.json(files))
    .catch(next);
}

function getByFilename(req, res, next) {
  fileService
    .getByFilename(req.params.filename)
    .then((file) => (file ? res.json(file) : res.sendStatus(404)))
    .catch(next);
}

async function getImage(req, res, next) {
  const file = await fileService.getByFilename(req.params.filename);

  // Check if file
  if (!file) {
    return res.status(404).json({
      err: "No file exists",
    });
  }

  // Check if image
  if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
    // Read output to browser
    const readstream = await fileService.getImageStream(file.filename);
    readstream.pipe(res);
  } else {
    res.status(404).json({
      err: "Not an image",
    });
  }
}

function uploadFile(req, res, next) {
  return res.status(200).json("/images/" + req.file.filename);
}

async function _delete(req, res, next) {
  await fileService.delete(req.params.id);
  res.status(200).json({ msg: "File deleted" });
}

/* 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.imageStoragePath);
  },
  filename: function (req, file, cb) {
    cb(null, newFileName(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("file"); */

/* 

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
 */
// helper methods

function newFileName(fileName) {
  const parts = fileName.split(".");
  const extension = parts.pop();
  const rest = parts.join(".");
  const random = Math.floor(Math.random() * 10000);
  return rest + random + "." + extension;
}
