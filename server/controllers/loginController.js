const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports.registerController = async function (req, res) {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(req.body.password, salt);

  try {
    const user = await User.create({
      username: req.body.username,
      password: hash,
      email: req.body.email,
    });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ statusMessage: "Registration failed" });
  }
};

module.exports.loginController = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email })
      .populate("roles", "name")
      .lean();

    if (!user) {
      return res.status(401).send({ statusMessage: "User not found" });
    }

    let passwordCheckStatus = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (passwordCheckStatus === true) {
      let userRolesArr = user.roles.map(function (role) {
        return role.name;
      });

      let userObj = { ...user, id: user._id.toString() };
      delete userObj.password; // remove password from userObj to store in the session
      delete userObj._id;
      delete userObj.__v;
      userObj.roles = userRolesArr;

      req.session.user = userObj;
      req.session.save(function (err) {
        if (err) {
          return res.status(500).json({ statusMessage: "Session save failed" });
        }
        res.json({ statusMessage: "Login success", data: userObj });
      });
    } else {
      res.status(401).send({ statusMessage: "Password didn't match" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ statusMessage: "Login failed" });
  }
};

module.exports.logoutController = async function (req, res) {
  req.session.destroy(function (err) {
    res.status(200).json({ statusMessage: "Logout success" });
  });
};
