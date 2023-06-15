import { Router } from "express";
import {
  deleteOne,
  get,
  findOne,
  update,
  addProduct,
} from "../controllers/productsController.js";


const productsRoute = Router();

productsRoute.get("/", get);

productsRoute.get("/:pid", findOne);

productsRoute.post("/", addProduct);

productsRoute.put("/:pid", update);

productsRoute.delete("/:pid", deleteOne);

export default productsRoute;
