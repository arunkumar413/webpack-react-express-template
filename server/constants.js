const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/mydatabase';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

module.exports = {
  MONGO_DB_URI,
  SERVER_PORT,
};