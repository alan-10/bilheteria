import { Schema, Document } from 'mongoose';
import { EventSchema } from "../../event/schemas/event.schema";

export const TicketSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  price: { type: Number, required: true },
  seat: { type: String, required: true },
});

export interface Ticket extends Document {
  id?: string;
  event: string; // Referência ao ID do Evento
  price: number;
  seat: string;
}
