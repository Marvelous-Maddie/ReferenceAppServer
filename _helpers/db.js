const mongoose = require('mongoose');
const config = require('../config');
const Grid = require('gridfs-stream');

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(config.connectionString, connectionOptions);

const connection = mongoose.createConnection(config.connectionString, connectionOptions);

const gridFileStorage = () => gfs;
let gfs;

// Init stream
connection.once('open', () => {
  gfs = Grid(connection.db, mongoose.mongo);
  //gridFileStorage = new mongoose.mongo.GridFSBucket(connection.db);
  gfs.collection('uploads');
});

mongoose.Promise = global.Promise;

module.exports = {
  Account: require('../accounts/account.model'),
  RefreshToken: require('../accounts/refresh-token.model'),
  isValidId,
  Page: require('../pages/page.model'),
  gridFileStorage,
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
