const User = require("../models/User");

module.exports.dynamicQueryParams = async function (req, res, next) {
  try {
    const queryParams = req.query;
    const allowedFilters = ["username", "email"];
    const filters = {};

    for (const param in queryParams) {
      if (
        Object.hasOwnProperty.call(queryParams, param) &&
        allowedFilters.includes(param)
      ) {
        filters[param] = queryParams[param];
      }
    }

    const users = await User.find(filters).populate("roles", "name");
    res.json(users);
  } catch (error) {
    console.error("Error executing user query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
