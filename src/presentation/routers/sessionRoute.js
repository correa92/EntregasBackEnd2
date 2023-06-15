import { Router } from "express";
import {
  current,
  forgetPassword,
  login,
  logout,
  signup,
} from "../controllers/sessionController.js";
import auth from "../middleware/auth.js";

const sessionRouter = Router();

sessionRouter.post("/login", login);
sessionRouter.get("/current", auth, current);
sessionRouter.post("/signup", signup);
sessionRouter.post("/logout", logout);
sessionRouter.post("/forget-password", forgetPassword);

export default sessionRouter;
