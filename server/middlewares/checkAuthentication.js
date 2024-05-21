module.exports.checkAuthentication = async function (req, res, next) {
  if (req.session) {
    console.log("########## session middleware ##############");
    next();
  } else {
    res.status(401).json({ statusMessage: "Session not found" });
  }
};
