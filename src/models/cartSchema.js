import mongoose, { Schema } from "mongoose";

const cartCollection = "cart";

const CartSchema = new Schema({
  products: [
    {
      idProduct: {
        type: Schema.Types.ObjectId,
        index: true,
        ref: "product",
        default: [],
      },
      quantity: { type: Schema.Types.Number, require: true },
    },
  ],
});

export default mongoose.model(cartCollection, CartSchema);
