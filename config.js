const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  connectionString: process.env.MONGODB_URI,
  secret: process.env.SECRET,
  emailFrom: process.env.EMAILFROM,
  emailFrom: process.env.EMAILFROM,
  smtpOptions: {
    host: process.env.SMTPHOST,
    port: process.env.SMTPPORT,
    auth: {
      user: process.env.SMTPUSER,
      pass: process.env.SMTPPASSWORD,
    },
  },
};
