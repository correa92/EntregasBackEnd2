import productSchema from "../../models/mongoose/productSchema.js";
import Product from "../../../domain/entities/Product.js";

class ProductMongooseRepository {
  async find(limitDoc = 5, pageDoc = 1, categoryDoc, statusDoc, sortDoc = 1) {
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

    const { docs, ...paginate } = productDocument;

    const products = docs.map((prod) => new Product(prod));

    return {
      products,
      paginate,
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
    return new Product(productDocument);
  }
  async updateStock(idProduct, stock) {
    const productDocument = await productSchema.findOneAndUpdate(
      { _id: idProduct },
      { $inc: { stock: -stock } },
      { new: true }
    );

    if (!productDocument) {
      throw new Error("The product does not exist");
    }
    return new Product(productDocument);
  }

  async findOne(id) {
    const productDocument = await productSchema.findOne({ _id: id });
    if (!productDocument) {
      throw new Error("Not exist products");
    }

    return new Product(productDocument);
  }

  async create(data) {
    const productDocument = await productSchema.create(data);
    return new Product(productDocument);
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
    return new Product(productDocument);
  }

  async deleteOne(id) {
    return productSchema.deleteOne({ _id: id });
  }
}

export default ProductMongooseRepository;
