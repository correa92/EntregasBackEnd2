import cartSchema from "../../models/mongoose/cartSchema.js";
import Cart from "../../../domain/entities/Cart.js";
import Product from "../../../domain/entities/Product.js";
import mongoose from "mongoose";

class CartMongooseRepository {
  async getOne(id) {
    const cartDocument = await cartSchema
      .findOne({ _id: id })
      .populate(["products.idProduct"]);

    const products = cartDocument.products.map((product) => {
      return {
        idProduct: product.idProduct._id.toString(),
        quantity: product.quantity,
      };
    });

    return new Cart({
      id: cartDocument?._id.toString(),
      products: products,
    });
  }

  async getCart(id) {
    const cartDocument = await cartSchema.findOne({ _id: id });

    const document = cartDocument.products.map((cart) => {
      return { idProduct: cart.idProduct.toString(), quantity: cart.quantity };
    });
    
    return new Cart({
      id: cartDocument?._id.toString(),
      products: document,
    });
  }

  async create() {
    const cartDocument = await cartSchema.create({ products: [] });

    if (!cartDocument) {
      throw new Error("Could not create cart");
    }
    return new Cart({
      id: cartDocument._id,
      products: cartDocument.products,
    });
  }

  async deleteOfCart(id, data) {
    const cartDocument = await cartSchema.findOneAndUpdate(
      { _id: id },
      { $pull: { products: { idProduct: data } } },
      {
        new: true,
      }
    );

    const document = cartDocument.products.map((cart) => {
      return { idProduct: cart.idProduct, quantity: cart.quantity };
    });

    return new Cart({
      id: cartDocument._id,
      products: document,
    });
  }

  async updateCart(id, data) {
    const cartDocument = await cartSchema.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    const document = cartDocument.products.map((cart) => {
      return { idProduct: cart.idProduct, quantity: cart.quantity };
    });

    return new Cart({
      id: cartDocument._id,
      products: document,
    });
  }
}

export default CartMongooseRepository;
