import ticketSchema from "../../models/mongoose/ticketSchema.js";
import Ticket from "../../../domain/entities/Ticket.js";

class TicketMongooseRepository {

  async createTicket(data) {
    const ticketDocument = await ticketSchema.create(data);

    return new Ticket({
      id: ticketDocument._id,
      code: ticketDocument.code,
      amount: ticketDocument.amount,
      purchase_datetime: ticketDocument.purchase_datetime,
      amount: ticketDocument.amount,
      purchase: ticketDocument.purchase,
    });
  }
}

export default TicketMongooseRepository;
