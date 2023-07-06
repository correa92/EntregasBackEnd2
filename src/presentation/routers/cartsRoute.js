import { Router } from "express";
import {
  createCart,
  findOne,
  updateCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  addListProducts,
  updateQuantity,
  buyCar
} from "../controllers/cartsController.js";
import authorization from "../middleware/authorization.js";
import auth from "../middleware/auth.js";

const cartsRoute = Router();

cartsRoute.get("/:cid",auth, authorization("getCart"), findOne);
cartsRoute.get("/:cid/purchase",auth, authorization("buyCar"), buyCar);
cartsRoute.delete("/:cid",auth, authorization("removeAllProductsFromCart"), removeAllProductsFromCart);
cartsRoute.delete("/:cid/product/:pid",auth, authorization("removeProductOfCar"), removeProductFromCart);
cartsRoute.post("/",auth, authorization("createCart"), createCart);
cartsRoute.put("/:cid",auth, authorization("addProductToCar"), addListProducts);
cartsRoute.post("/:cid/product/:pid",auth, authorization("updateCar"), updateCart);
cartsRoute.put("/:cid/product/:pid",auth, authorization("updateQuantity"), updateQuantity);

export default cartsRoute;
