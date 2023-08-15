import { Router } from "express";
import auth from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";
import {
  list,
  deleteOne,
  getOne,
  save,
  update,
  createDocument,
} from "../controllers/userController.js";
import { uploader } from "../middleware/multer.js";

const userRouter = Router();

userRouter.get("/", auth, authorization("getUsers"), list);
userRouter.get("/:id", auth, authorization("getUser"), getOne);
userRouter.post("/", auth, authorization("saveUser"), save);
userRouter.post(
  "/:id/documents",
  auth,
  authorization("saveMultimedia"),
  uploader.single("file"),
  createDocument
);
userRouter.put("/:id", auth, authorization("updateUser"), update);
userRouter.delete("/:id", auth, authorization("deleteUser"), deleteOne);
export default userRouter;
