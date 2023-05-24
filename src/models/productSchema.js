import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "product";

const ProductSchema = new Schema({
  title: { type: Schema.Types.String, require: true, trim: true },
  description: { type: Schema.Types.String, require: true, trim: true },
  price: { type: Schema.Types.Number, require: true },
  thumbnail: { type: [String], require: true, default:[] },
  code: { type: Schema.Types.String, require: true, unique: true, trim: true },
  stock: { type: Schema.Types.Number, require: true },
  category: { type: Schema.Types.String, require: true, trim: true },
  status: { type: Schema.Types.Boolean, default: true },
  id: { type: Schema.Types.Number, default: true, unique: true },
});
ProductSchema.plugin(mongoosePaginate);

export default mongoose.model(productCollection, ProductSchema);
