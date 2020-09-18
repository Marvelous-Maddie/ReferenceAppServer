const { gfs } = require("_helpers/db");
const GridFsStorage = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = newFileName(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

module.exports = {
  storage,
  getAll,
  getByFilename,
  delete: _delete,
  getImageStream,
};

async function getAll() {
  //console.log(gfs());
  const files = await gfs().files.find().toArray();
  return files;
}

async function getByFilename(filename) {
  const file = await gfs().files.findOne({ filename: filename });
  return file;
}

async function getImageStream(filename) {
  const file = await getByFilename(filename);
  console.log(file);
  if (!file) return;
  const readstream = gfs().createReadStream(file.filename);
  return readstream;
}

async function _delete(id) {
  await gfs().remove({ _id: id, root: "uploads" });
}

// helper functions

function basicDetails(page) {
  const { _id, title, slug, subtitle, content, comments } = page;
  return { _id, title, slug, subtitle, content, comments };
}

function newFileName(fileName) {
  console.log("newFileName " + fileName);
  const parts = fileName.split(".");
  const extension = parts.pop();
  const rest = parts.join(".");
  const random = Math.floor(Math.random() * 10000);
  return rest + random + "." + extension;
}
