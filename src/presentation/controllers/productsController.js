import { paginate } from "mongoose-paginate-v2";
import ProductManager from "../../domain/managers/ProductsManager.js";

export const get = async (req, res, next) => {
  try {
    const classPM = new ProductManager();
    
    const { limit, page, category, status, sort } = req.query;

    if (status != undefined && status != "true" && status != "false") {
      return res
        .status(400)
        .json({ status: "Error", Error: "The status must be true or false" });
    }

    if (sort != undefined && sort != "asc" && sort != "desc") {
      return res
        .status(400)
        .json({ status: "Error", Error: `The sort must be asc or desc` });
    }

    const data = await classPM.find(limit, page, category, status, sort);

    return res.json({
      status: "success",
      message: "Products obtained successfully",
      payload: data.products,
      totalPages: data.paginate.totalPages,
      prevPage: data.paginate.prevPage,
      nextPage: data.paginate.nextPage,
      page: data.paginate.page,
      hasPrevPage: data.paginate.hasPrevPage,
      hasNextPage: data.paginate.hasNextPage,
      prevLink: data.paginate.prevLink,
      nextLink: data.paginate.nextLink,
    });
  } catch (e) {
    next(e);
  }
};

export const findOne = async (req, res, next) => {
  try {
    const classPM = new ProductManager();
    let pid = req.params.pid;
    const product = await classPM.findOne(pid);

    return res.status(200).json({
      status: "success",
      message: "Product obtained successfully",
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const classPM = new ProductManager();
    const addProduct = await classPM.create(req.body);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: addProduct,
    });
  } catch (e) {
    next(e);
  }
};

export const update = async (req, res, next) => {
  try {
    const classPM = new ProductManager();
    const idProduct = req.params.pid;
    const body = req.body;
    const updateProduct = await classPM.updateOne(idProduct, body);

    if (updateProduct.Error) {
      return res.status(400).json({ Error: updateProduct.Error });
    }
    return res.status(201).json({
      status: "success",
      message: "Product updated successfully",
      data: updateProduct,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const classPM = new ProductManager();
    const id = req.params.pid;
    const deleteProduct = await classPM.deleteOne(id);

    return res.status(201).json({
      status: "success",
      message: "Product removed successfully",
      data: deleteProduct,
    });
  } catch (error) {
    next(e);
  }
};
