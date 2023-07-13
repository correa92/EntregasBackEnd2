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

cartsRoute.post("/",auth, authorization("createCart"), createCart);
cartsRoute.post("/:cid/product/:pid",auth, authorization("updateCar"), updateCart);
cartsRoute.get("/:cid",auth, authorization("getCart"), findOne);
cartsRoute.put("/:cid/product/:pid",auth, authorization("updateQuantity"), updateQuantity);
cartsRoute.put("/:cid",auth, authorization("addProductToCar"), addListProducts);
cartsRoute.delete("/:cid/product/:pid",auth, authorization("removeProductOfCar"), removeProductFromCart);
cartsRoute.delete("/:cid",auth, authorization("removeAllProductsFromCart"), removeAllProductsFromCart);
cartsRoute.get("/:cid/purchase",auth, authorization("buyCar"), buyCar);

export default cartsRoute;
