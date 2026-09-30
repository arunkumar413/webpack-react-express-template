const User = require("../models/User");

module.exports.getUsers = async function (req, res) {
  try {
    const users = await User.find().populate("roles", "name");
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).json({ statusMessage: "Unable to fetch users" });
  }
};
