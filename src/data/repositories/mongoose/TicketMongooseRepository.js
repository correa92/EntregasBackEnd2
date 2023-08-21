import ticketSchema from "../../models/mongoose/ticketSchema.js";
import Ticket from "../../../domain/entities/Ticket.js";

class TicketMongooseRepository {

  async createTicket(data) {
    const ticketDocument = await ticketSchema.create(data);

    return new Ticket(ticketDocument);
  }
}

export default TicketMongooseRepository;
