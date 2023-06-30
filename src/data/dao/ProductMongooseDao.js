import productSchema from "../models/productSchema.js";

class ProductMongooseDao {
  async find(limitDoc = 10, pageDoc = 1, categoryDoc, statusDoc, sortDoc = 1) {
    const query = {};

    if (categoryDoc != undefined) {
      query.category = categoryDoc;
    }
    if (statusDoc != undefined) {
      query.status = statusDoc;
    }

    const productDocument = await productSchema.paginate(query, {
      limit: limitDoc,
      sort: { price: sortDoc === "asc" ? 1 : -1 },
      page: pageDoc,
    });

    return {
      docs: productDocument.docs.map((doc) => ({
        title: doc.title,
        description: doc.description,
        price: doc.price,
        thumbnail: doc.thumbnail,
        code: doc.code,
        stock: doc.stock,
        category: doc.category,
        status: doc.status,
        id: doc.id,
      })),
      totalPages: productDocument.totalPages,
      prevPage: productDocument.prevPage,
      nextPage: productDocument.nextPage,
      page: productDocument.page,
      hasPrevPage: productDocument.hasPrevPage,
      hasNextPage: productDocument.hasNextPage,
      prevLink:
        productDocument.hasPrevPage === false
          ? null
          : productDocument.hasPrevPage,
      nextLink:
        productDocument.hasNextPage === false
          ? null
          : productDocument.hasNextPage,
    };
  }
  async deleteOfCar(id) {
    const productDocument = await productSchema.findOneAndUpdate(
      { _id: id },
      { $pull: { products: { idProduct: id } } },
      { new: true }
    );
    if (!productDocument) {
      throw new Error("The product does not exist");
    }
    return {
      title: productDocument?.title,
      description: productDocument?.description,
      price: productDocument?.price,
      thumbnail: productDocument?.thumbnail,
      code: productDocument?.code,
      stock: productDocument?.stock,
      category: productDocument?.category,
      status: productDocument?.status,
      id: productDocument?.id,
    };
  }
  async updateStock( idProduct, stock) {

    const productDocument = await productSchema.findOneAndUpdate(
      { _id: idProduct },
      { $inc: { stock: -stock } },
      { new: true }
    );

    if (!productDocument) {
      throw new Error("The product does not exist");
    }
    return {
      title: productDocument?.title,
      description: productDocument?.description,
      price: productDocument?.price,
      thumbnail: productDocument?.thumbnail,
      code: productDocument?.code,
      stock: productDocument?.stock,
      category: productDocument?.category,
      status: productDocument?.status,
      id: productDocument?.id,
    };
  }

  async findOne(id) {
    const productDocument = await productSchema.findOne({ _id: id });

    return {
      title: productDocument?.title,
      description: productDocument?.description,
      price: productDocument?.price,
      thumbnail: productDocument?.thumbnail,
      code: productDocument?.code,
      stock: productDocument?.stock,
      category: productDocument?.category,
      status: productDocument?.status,
      id: productDocument?.id,
      _id: productDocument?._id.toString(),
    };
  }

  async create(data) {
    const productDocument = await productSchema.create(data);

    return {
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      thumbnail: productDocument.thumbnail,
      code: productDocument.code,
      stock: productDocument.stock,
      category: productDocument.category,
      status: productDocument.status,
      id: productDocument.id,
    };
  }

  async updateOne(id, data) {
    const productDocument = await productSchema.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    );

    if (!productDocument) {
      throw new Error("The product does not exist");
    }
    return {
      title: productDocument?.title,
      description: productDocument?.description,
      price: productDocument?.price,
      thumbnail: productDocument?.thumbnail,
      code: productDocument?.code,
      stock: productDocument?.stock,
      category: productDocument?.category,
      status: productDocument?.status,
      id: productDocument?.id,
    };
  }

  async deleteOne(id) {
    return productSchema.deleteOne({ _id: id });
  }
}

export default ProductMongooseDao;
