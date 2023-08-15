import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import SessionManager from "../../domain/managers/sessionManager.js";
import UserManager from "../../domain/managers/userManager.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const manager = new SessionManager();

    const accessToken = await manager.login(email, password);

    req.session.user = { email };

    res
      .cookie("accessToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({
        status: "success",
        message: "Login success! welcome",
        accessToken,
      });
  } catch (e) {
    next(e);
  }
};

export const current = async (req, res, next) => {
  try {
    res.status(200).send({ status: "Success", payload: req.user });
  } catch (e) {
    next(e);
  }
};

export const signup = async (req, res, next) => {
  try {
    req.body.age = parseInt(req.body.age);
    req.body.isAdmin = Boolean(req.body.isAdmin);

    const manager = new SessionManager();
    const user = await manager.signup(req.body);

    return res
      .status(201)
      .send({ status: "success", user, message: "User created." });
  } catch (e) {
    next(e);
  }
};
export const logout = (req, res, next) => {
  try {
    req.session.destroy(async (err) => {
      if (!err) {
        const idUser = req.user.id;
        const UM = new UserManager();
        await UM.updateOne(idUser, { last_connection: dayjs() });
        delete req.headers.authorization;
        return res.status(201).send({ message: "Logout success!" });
      }

      res.send({ message: "Logout error!", body: err });
    });
  } catch (e) {
    next(e);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    jwt.verify(token, process.env.PRIVATE_KEY, async (error, credentials) => {
      if (error) {
        return res.status(403).send({ error: "Not authorized" });
      }
      const user = credentials.user;
      const manager = new SessionManager();
      const newData = await manager.forgetPassword(user.email, password);

      res
        .status(201)
        .send({ status: "success", newData, message: "User change password." });
    });
  } catch (e) {
    next(e);
  }
};
