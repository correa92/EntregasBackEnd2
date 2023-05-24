import { Router } from "express";
import {
  createCart,
  findOne,
  updateCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  addListProducts,
  updateQuantity,
} from "../controllers/cartsController.js";

const cartsRoute = Router();

cartsRoute.get("/:cid", findOne);

cartsRoute.delete("/:cid", removeAllProductsFromCart);

cartsRoute.delete("/:cid/products/:pid", removeProductFromCart);

cartsRoute.post("/", createCart);

cartsRoute.put("/:cid", addListProducts);

cartsRoute.post("/:cid/product/:pid", updateCart);

cartsRoute.put("/:cid/product/:pid", updateQuantity);

export default cartsRoute;
