import { Router } from "express";
import { send } from "../controllers/mailController.js";

const mailRouter = Router();

mailRouter.post("/", send);

export default mailRouter;
