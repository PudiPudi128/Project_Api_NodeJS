require('dotenv').config();

exports.config = {
  PORT: process.env.PORT,
  PASS_DB: process.env.PASS_DB,
  USER_DB: process.env.USER_DB,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
};
