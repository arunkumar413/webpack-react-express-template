const Todo = require("../models/Todo");

module.exports.getMyTasks = async function (req, res) {
  try {
    const todos = await Todo.find({ user: req.session.user.id });
    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ statusMessage: "Unable to fetch tasks" });
  }
};
