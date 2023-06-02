import CartManager from "../managers/CartsManager.js";

export const findOne = async (req, res, next) => {
  try {
    const classCM = new CartManager();
    let cid = req.params.cid;

    const cart = await classCM.getOne(cid);

    return res.status(200).json({
      status: "success",
      message: "Cart obtained successfully",
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const classCM = new CartManager();
    const addProduct = await classCM.create(req.body);

    return res.status(201).json({
      status: "success",
      message: "Cart created successfully",
      data: addProduct,
    });
  } catch (e) {
    next(e);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const classCM = new CartManager();

    let { cid, pid } = req.params;

    const response = await classCM.addToCart(cid, pid);

    if (response.Error) {
      return res.status(400).json({
        status: "error",
        message: Error,
        error: Error,
      });
    }

    return res.status(201).json({ status: "success", data: response });
  } catch (e) {
    next(e);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const classCM = new CartManager();

    const { cid, pid } = req.params;

    const cart = await classCM.removeProductFromCart(cid, pid);

    return res.status(201).json({
      status: "success",
      message: "Product successfully removed",
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};

export const removeAllProductsFromCart = async (req, res, next) => {
  try {
    const classCM = new CartManager();

    const { cid } = req.params;

    const cart = await classCM.removeAllProductFromCart(cid);

    return res.status(201).json({
      status: "success",
      message: "All products successfully removed",
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};

export const addListProducts = async (req, res, next) => {
  try {
    const classCM = new CartManager();

    const { cid } = req.params;
    const body = req.body;

    const cart = await classCM.addListProducts(cid, body);

    return res.status(201).json({
      status: "success",
      message: "Product list added successfully ",
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const classCM = new CartManager();

    let { cid, pid } = req.params;
    const body = req.body;

    const response = await classCM.updateQuantity(cid, pid, body);

    if (response.Error) {
      return res.status(400).json({
        status: "error",
        message: Error,
        Error: error,
      });
    }

    return res.status(201).json({ status: "success", data: response });
  } catch (e) {
    next(e);
  }
};