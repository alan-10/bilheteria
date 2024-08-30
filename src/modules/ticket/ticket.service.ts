import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket';
import { EventService } from '../event/event.service';

@Injectable()
export class TicketService {
  constructor(@InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
    private readonly eventService: EventService,) { }

  async createTicket(event: string, price: number, seat: string): Promise<Ticket> {

    await this.eventService.getEventById(event);

    const newTicket = new this.ticketModel({ event, price, seat });
    return await newTicket.save();
  }

  async getTickets(): Promise<Ticket[]> {
    return await this.ticketModel.find().populate('event').exec();
  }

  async getTicketById(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId).populate('event').exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async updateTicket(ticketId: string, event: string, price: number, seat: string): Promise<Ticket> {
    const updatedTicket = await this.ticketModel.findByIdAndUpdate(ticketId, { event, price, seat }, { new: true }).populate('event');
    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }
    return updatedTicket;
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const result = await this.ticketModel.findByIdAndDelete(ticketId).exec();
    if (!result) {
      throw new NotFoundException('Ticket not found');
    }
  }
}
