import cartSchema from "../../models/mongoose/cartSchema.js";
import Cart from "../../../domain/entities/Cart.js";

class CartMongooseRepository {
  async getOne(id) {
    const cartDocument = await cartSchema
      .findOne({ _id: id })
      .populate(["products.idProduct"]);

    return new Cart({
      id: cartDocument?._id,
      products: cartDocument?.products,
    });
  }

  async getCart(id) {
    const cartDocument = await cartSchema.findOne({ _id: id });

    return new Cart({
      id: cartDocument?._id,
      products: cartDocument?.products,
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
