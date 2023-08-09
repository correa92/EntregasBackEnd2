
const errorHandler = (err, req, res, next) => {
  
  if (err?.message.includes("Not Found")) {
    req.logger.warning(err.stack);

    return res.status(404).json({ message: err.message });

  } else if (err?.name.includes("ZodError")) {
    req.logger.warning(err.stack);
    return res.status(400).json({ message: err.issues });

  } else if (err?.message.includes("invalid password.")) {

    req.logger.warning(err.stack);
    return res.status(401).send({ message: "Login failed, invalid password." });

  } else if (err?.message.includes("Email and Password invalid format.")) {
    req.logger.warning(err.stack);
    return res
      .status(401)
      .send({ message: "Email and Password invalid format." });

  } else if (err?.message) {
    req.logger.warning(err.stack);
    return res.status(400).json({ message: err.message });
  }

  req.logger.warning(err.stack);
  res.status(500).json({ message: "Unexpected error." });
};

export default errorHandler;
