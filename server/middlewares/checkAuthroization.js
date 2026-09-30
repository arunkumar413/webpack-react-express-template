module.exports.checkAuthorization = function (accessCheckObj) {
  return async function (req, res, next) {
    try {
      const sessionUser = req.session.user;
      if (!sessionUser) {
        return res.status(401).json({ statusMessage: "Session not found" });
      }

      const userRoles = sessionUser.roles || [];
      const userPermissions = sessionUser.permissions || [];
      const requiredRoles =
        accessCheckObj.rolesWithAccess || accessCheckObj.roles || [];
      const requiredPermissions = accessCheckObj.permissions || [];

      const hasRole =
        requiredRoles.length === 0 ||
        userRoles.some((role) => requiredRoles.includes(role));

      const hasPermission =
        requiredPermissions.length === 0 ||
        requiredPermissions.some((permission) =>
          userPermissions.includes(permission)
        );

      if (hasRole && hasPermission) {
        return next();
      }

      res.status(403).json({ statusMessage: "Authorization failed" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ statusMessage: "Authorization check failed" });
    }
  };
};
