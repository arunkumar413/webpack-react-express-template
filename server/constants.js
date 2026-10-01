const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/mydatabase';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const ADMIN_PERMISSIONS = [
  "employee.read",
  "employee.write",
  "employee.update",
  "employee.delete",
  "task.read",
  "task.write",
  "task.update",
  "task.delete",
  "department.read",
  "department.write",
  "department.update",
  "department.delete",
];

module.exports = {
  MONGO_DB_URI,
  SERVER_PORT,
  SESSION_MAX_AGE_MS,
  ADMIN_PERMISSIONS,
};