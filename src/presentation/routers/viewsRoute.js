import { Router } from "express";
import ProductManager from "../dao/managersFileSystem/ProductManager.js";

const viewsRoute = Router();

const classPM = new ProductManager();

viewsRoute.get("/", async (req, res) => {
  try {
    const products = await classPM.getProducts();
    if (products.Error) {
      return res.status(400).json({ Error: products.Error });
    }

    return res.render("home", { products });
  } catch (error) {
    return res.status(400).json({ Error: error });
  }
});

viewsRoute.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await classPM.getProducts();
    if (products.Error) {
      return res.status(400).json({ Error: products.Error });
    }
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(400).json({ Error: error });
  }
});

export default viewsRoute;
