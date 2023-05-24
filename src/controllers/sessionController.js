import UserManager from "../managers/userManager.js";
import { createHash, isValidPassword } from "../shared/shared.js";
import loginValidation from "../validations/loginValidation.js";
import signupValidation from "../validations/signupValidation.js";

export const login = async (req, res, next) => {
  try {
    await loginValidation.parseAsync(req.body);

    const { email, password } = req.body;

    const manager = new UserManager();
    const user = await manager.getOneByEmail(email);

    if (user.id === undefined) {
      return res
        .status(400)
        .json({ status: "Error", Error: "The email is not registered" });
    }

    const isHashedPassword = isValidPassword(password, user.password);

    if (!isHashedPassword) {
      return res
        .status(401)
        .send({ message: "Login failed, invalid password." });
    }

    req.session.user = { email };

    delete user.password;

    return res.send({
      status: "success",
      message: "Login success! welcome",
      user,
    });
  } catch (e) {
    next(e);
  }
};

export const loginWithPassport = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });
    }

    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    };

    res.send({ status: "success", message: "Login success" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.status(200).json({ status: "success", message: "Logout ok!" });
    }

    return res
      .status(400)
      .json({ status: "success", message: "Logout error!", body: err });
  });
};

export const signup = async (req, res, next) => {
  try {
    req.body.age = parseInt(req.body.age);

    await signupValidation.parseAsync(req.body);

    const classUM = new UserManager();

    const payload = {
      ...req.body,
      password: await createHash(req.body.password),
    };

    const user = await classUM.create(payload);
    if (user.id === undefined) {
      return res
        .status(400)
        .json({ status: "Error", Error: "The email already exists" });
    }

    return res
      .status(201)
      .send({ status: "success", user, message: "User created." });
  } catch (e) {
    next(e);
  }
};

export const register = (req, res, netx) => {
  try {
    async(res.send({ status: "success", message: " User registered" }));
  } catch (e) {
    netx(e);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    await loginValidation.parseAsync(req.body);
    const { email, password } = req.body;

    const manager = new UserManager();

    const dto = {
      email,
      password: await createHash(password, 10),
    };

    const user = await manager.forgetPassword(dto);

    res
      .status(200)
      .send({ status: "success", user, message: "User change password." });
  } catch {
    next(e);
  }
};

export const fail = async (req, res)=>
{
  console.log('Failed strategy');
  res.status(400).send({ error: 'Failed' });
};
