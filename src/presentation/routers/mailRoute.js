import { Router } from "express";
import { forgotPassword } from "../controllers/mailController.js";

const mailRouter = Router();

mailRouter.post("/forgot-password", forgotPassword);

export default mailRouter;
