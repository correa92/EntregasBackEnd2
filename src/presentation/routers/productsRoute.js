import { Router } from "express";
import {
  deleteOne,
  get,
  findOne,
  update,
  addProduct,
} from "../controllers/productsController.js";
import auth from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";


const productsRoute = Router();

productsRoute.get("/", get);

productsRoute.get("/:pid",auth, authorization("productsAdmin"), findOne);

productsRoute.post("/",auth, authorization("productsAdmin"), addProduct);

productsRoute.put("/:pid",auth, authorization("productsAdmin"), update);

productsRoute.delete("/:pid",auth, authorization("productsAdmin"), deleteOne);

export default productsRoute;
