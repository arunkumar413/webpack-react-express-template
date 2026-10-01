const { touchAuthSession } = require("../utils/sessionRegistry");

module.exports.checkAuthentication = async function (req, res, next) {
  if (req.session.user && req.session.user.id) {
    touchAuthSession(req);
    next();
  } else {
    res.status(401).json({ statusMessage: "Session not found" });
  }
};
