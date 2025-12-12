// Secret key for signing JWT tokens
const JWT_SECRET =
  "c37d6f5d5c1c03fc49fc9ec15ab800217050bf213298f2873fedc894ea0a7298";

const PORT = process.env.PORT || 3001;
const MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db";

module.exports = {
  JWT_SECRET,
  PORT,
  MONGO_URI,
};
