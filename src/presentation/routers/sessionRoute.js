import { Router } from "express";
import {
  current,
  forgetPassword,
  login,
  logout,
  signup,
  changePassword,
  recoveringPassword
} from "../controllers/sessionController.js";
import { forgotPassword as forgotPasswordMail } from "../controllers/mailController.js";
import auth from "../middleware/auth.js";

const sessionRouter = Router();

sessionRouter.post("/login", login);
sessionRouter.get("/current", auth, current);
sessionRouter.post("/signup", signup);
sessionRouter.post("/logout", auth, logout);

sessionRouter.post("/send-password-recovery", forgotPasswordMail);
sessionRouter.get("/forget-password/:token", recoveringPassword);
sessionRouter.post("/forget-password/:token", forgetPassword); 

sessionRouter.post("/change-password", auth, changePassword);

export default sessionRouter;
