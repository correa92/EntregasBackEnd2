import cartSchema from "../models/cartSchema.js";

class CartMongooseDao {
  async getOne(id) {
    const cartDocument = await cartSchema.findOne({ _id: id }).populate(['products.idProduct']);

    return {
      id: cartDocument?._id,
      products: cartDocument?.products,
    };
  }

  async create() {
    const cartDocument = await cartSchema.create({ products: [] });

    return {
      id: cartDocument._id,
      products: cartDocument.products,
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
