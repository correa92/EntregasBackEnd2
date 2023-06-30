import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketCollection = "ticket";

const TicketsSchema = new Schema({
  id: { type: Schema.Types.ObjectId, unique: true },
  code: { type: Schema.Types.String, require: true, unique: true, trim: true },
  purchase_datetime:{ type: Schema.Types.Date, default: dayjs() },
  amount : { type: Schema.Types.Number, require: true },
  purchase: { type: Schema.Types.String, require: true, trim: true },
});
TicketsSchema.plugin(mongoosePaginate);

export default mongoose.model(ticketCollection, TicketsSchema);
