import mongoose, { Schema } from "mongoose";

const cartCollection = "cart";

const CartSchema = new Schema({
  products: [
    {
      idProduct: {
        type: Schema.Types.ObjectId,
        index: true,
        ref: "product",
      },
      quantity: { type: Schema.Types.Number },
    },
  ],
});

export default mongoose.model(cartCollection, CartSchema);
