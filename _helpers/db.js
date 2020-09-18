const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);

const connection = mongoose.createConnection(
  process.env.MONGODB_URI,
  connectionOptions
);

let gridFileStorage;
const gfs = () => {
  return gridFileStorage;
};

// Init stream
connection.once("open", () => {
  console.log("in once");
  gridFileStorage = Grid(connection.db, mongoose.mongo);
  //gridFileStorage = new mongoose.mongo.GridFSBucket(connection.db);
  gridFileStorage.collection("uploads");
});

mongoose.Promise = global.Promise;

module.exports = {
  Account: require("../accounts/account.model"),
  RefreshToken: require("../accounts/refresh-token.model"),
  isValidId,
  Page: require("../pages/page.model"),
  gfs,
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
