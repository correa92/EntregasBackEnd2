import ProductManager from "../../domain/managers/ProductsManager.js";

export const get = async (req, res) => {
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

    const products = await classPM.find(limit, page, category, status, sort);

    return res.json({
      status: "success",
      message: "Products obtained successfully",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    });
  } catch (error) {
    return res.status(400).json({ status: "Error", Error: error });
  }
};

export const findOne = async (req, res) => {
  try {
    const classPM = new ProductManager();
    let pid = req.params.pid;
    const product = await classPM.findOne(pid);

    return res.status(200).json({
      status: "success",
      message: "Product obtained successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({ status: "Error", Error: error });
  }
};

export const addProduct = async (req, res) => {
  try {
    const classPM = new ProductManager();
    const addProduct = await classPM.create(req.body);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: addProduct,
    });
  } catch (error) {
    return res.status(400).json({ status: "Error", Error: error });
  }
};

export const update = async (req, res) => {
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
  } catch (error) {
    return res.status(400).json({ status: "Error", Error: error });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const classPM = new ProductManager();
    const id = req.params.pid;
    const deleteProduct = await classPM.deleteOne(id);

    return res.status(200).json({
      status: "success",
      message: "Product removed successfully",
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(400).json({ status: "Error", Error: error });
  }
};
