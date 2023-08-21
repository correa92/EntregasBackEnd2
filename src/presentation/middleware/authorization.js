const authorization = (permission) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user.role?.permissions.includes(permission)) {
      return res.status(401).send({
        message: "Not authorization!, you do not have the permissions",
      });
    }

    next();
  };
};

export default authorization;
