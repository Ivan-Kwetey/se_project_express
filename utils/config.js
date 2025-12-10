const {
  JWT_SECRET = "dev-secret",
  PORT = 3001,
  MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db",
} = process.env;

module.exports = { JWT_SECRET, PORT, MONGO_URI };
