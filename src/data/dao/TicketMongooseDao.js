import ticketSchema from "../models/ticketSchema.js";

class TicketMongooseDao {
  async createTicket(data) {
    const ticketDocument= await ticketSchema.create(data);
    return {
        id: ticketDocument._id,
        code : ticketDocument.code,
        amount : ticketDocument.amount,
        purchase_datetime: ticketDocument.purchase_datetime,
        amount : ticketDocument.amount,
        purchase: ticketDocument.purchase
    }
  }
}

export default TicketMongooseDao;