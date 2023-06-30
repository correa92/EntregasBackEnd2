import cartSchema from "../models/cartSchema.js";

class CartMongooseDao {
  async getOne(id) {
    const cartDocument = await cartSchema
      .findOne({ _id: id })
      .populate(["products.idProduct"]);

    return {
      id: cartDocument?._id,
      products: cartDocument?.products,
    };
  }

  async getCart(id) {
    const cartDocument = await cartSchema.findOne({ _id: id });

    return {
      id: cartDocument?._id,
      products: cartDocument?.products,
    };
  }

  async create() {
    const cartDocument = await cartSchema.create({ products: [] });

    if (!cartDocument) {
      throw new Error("Could not create cart");
    }
    return {
      id: cartDocument._id,
      products: cartDocument.products,
    };
  }

  async deleteOfCart(id, data) {
    const cartDocument = await cartSchema.findOneAndUpdate(
      { _id: id },
      { $pull: { products: { idProduct: data } } },
      {
        new: true,
      }
    );
    return {
      id: cartDocument._id,
      products: cartDocument.products.map((cart) => {
        return { idProduct: cart.idProduct, quantity: cart.quantity };
      }),
    };
  }

  async updateCart(id, data) {
    const cartDocument = await cartSchema.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return {
      id: cartDocument._id,
      products: cartDocument.products.map((cart) => {
        return { idProduct: cart.idProduct, quantity: cart.quantity };
      }),
    };
  }
}

export default CartMongooseDao;
