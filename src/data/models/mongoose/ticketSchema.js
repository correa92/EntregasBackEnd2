import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketCollection = "ticket";

const TicketsSchema = new Schema({
  id: { type: Schema.Types.Number, default: true, unique: true },
  code: { type: Schema.Types.String, require: true, unique: true, trim: true },
  purchase_datetime: { type: Schema.Types.Date, default: dayjs() },
  amount: { type: Schema.Types.Number, require: true },
  purchase: { type: Schema.Types.String, require: true, trim: true },
  list: { type: [{}], default:[] },
});
TicketsSchema.plugin(mongoosePaginate);

TicketsSchema.pre("save", async function (next) {
  const doc = this;
  try {
    const count = await mongoose.model(ticketCollection).countDocuments();
    doc.id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model(ticketCollection, TicketsSchema);
